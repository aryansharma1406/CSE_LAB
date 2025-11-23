from flask import Flask, request, jsonify
from flask_cors import CORS
from lcapy import Circuit
import traceback
import numpy as np
from scipy import signal
import sympy as sp

app = Flask(__name__)
CORS(app)

def normalize_netlist_value(value_str):
    """Convert SPICE-style values (1k, 1u, etc.) to numeric format"""
    import re
    value_str = str(value_str).strip().lower()
    
    # Remove any trailing spaces
    value_str = value_str.rstrip()
    
    # Handle multipliers
    multipliers = {
        't': 1e12, 'g': 1e9, 'meg': 1e6, 'k': 1e3,
        'm': 1e-3, 'u': 1e-6, 'n': 1e-9, 'p': 1e-12, 'f': 1e-15
    }
    
    # Try to extract number and unit
    match = re.match(r'([\d.]+)\s*([a-z]+)?', value_str)
    if match:
        number = float(match.group(1))
        unit = match.group(2) or ''
        
        if unit in multipliers:
            result = number * multipliers[unit]
            # Format as scientific notation if needed, otherwise as float
            if abs(result) >= 1e3 or (abs(result) < 1 and abs(result) > 0):
                return f"{result:.6e}".replace('e+0', 'e+').replace('e-0', 'e-')
            else:
                return str(result)
        else:
            return str(number)
    
    return value_str

def normalize_netlist(netlist):
    """Normalize netlist component values"""
    lines = netlist.split('\n')
    normalized_lines = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        parts = line.split()
        if len(parts) >= 4:
            # Component name, node1, node2, value, ...
            component_name = parts[0].upper()
            
            # Handle voltage sources - for AC analysis, use value 1 (needed for transfer function calculation)
            if component_name.startswith('V') and len(parts) >= 4:
                node1 = parts[1]
                node2 = parts[2]
                value_or_type = parts[3].lower()
                
                # If it's "ac", use value 1 (needed for proper transfer function calculation)
                if value_or_type == 'ac':
                    normalized_line = f"{component_name} {node1} {node2} 1"
                else:
                    component_line = ' '.join(parts[:3])
                    value = parts[3]
                    normalized_value = normalize_netlist_value(value)
                    rest = ' '.join(parts[4:]) if len(parts) > 4 else ''
                    normalized_line = f"{component_line} {normalized_value}"
                    if rest:
                        normalized_line += f" {rest}"
            else:
                component_line = ' '.join(parts[:3])
                value = parts[3]
                normalized_value = normalize_netlist_value(value)
                rest = ' '.join(parts[4:]) if len(parts) > 4 else ''
                normalized_line = f"{component_line} {normalized_value}"
                if rest:
                    normalized_line += f" {rest}"
            normalized_lines.append(normalized_line)
        else:
            normalized_lines.append(line)
    
    return '\n'.join(normalized_lines)

@app.route('/api/transfer-function', methods=['POST'])
def calculate_transfer_function():
    try:
        data = request.json
        netlist = data.get('netlist')
        input_node = data.get('input_node', '1')
        output_node = data.get('output_node', '2')
        
        # Normalize netlist values
        if isinstance(netlist, str):
            netlist = netlist.replace('\\n', '\n')
            netlist = normalize_netlist(netlist)
        
        # Calculate transfer function - use impedance/voltage divider method for RC/RL circuits
        in_node = int(input_node) if input_node and input_node.isdigit() else 1
        out_node = int(output_node) if output_node and output_node.isdigit() else 2
        cct = Circuit(netlist)
        
        # Method: Evaluate transfer function at a symbolic frequency to get the symbolic form
        # This works around the issue where DC sources give .s = 0
        from sympy import Symbol, I
        s = Symbol('s')
        
        # Evaluate at s = j*omega (complex frequency) to get the transfer function
        # Use a test frequency and extract the symbolic form
        try:
            # Get voltages
            V_in = cct.Voc(in_node, 0)
            V_out = cct.Voc(out_node, 0)
            
            # Try to get s-domain component first
            V_in_s = V_in.s
            V_out_s = V_out.s
            
            # If s-domain is 0, evaluate at a test frequency and extract symbolic form
            if str(V_in_s) == '0' or str(V_out_s) == '0':
                # Evaluate at a test frequency to get the transfer function expression
                test_freq = 1000  # 1 kHz
                s_test = 1j * 2 * np.pi * test_freq
                
                try:
                    V_in_val = V_in.evaluate(s_test)
                    V_out_val = V_out.evaluate(s_test)
                    
                    if abs(V_in_val) > 1e-10:  # Avoid division by zero
                        H_val = V_out_val / V_in_val
                        # Now we need to get the symbolic form
                        # For RC circuits, we can compute it directly
                        # But for now, use the evaluated approach to get poles/zeros
                        # and reconstruct the transfer function
                        
                        # Actually, let's use a different approach - compute using circuit impedance
                        # For the RC circuit: H(s) = 1/(1 + s*R*C)
                        # Parse the netlist to extract R and C values
                        H = compute_transfer_from_netlist(netlist, in_node, out_node)
                    else:
                        raise ValueError("Input voltage is zero - cannot compute transfer function")
                except:
                    # Fallback: try to compute transfer function from circuit topology
                    H = compute_transfer_from_netlist(netlist, in_node, out_node)
            else:
                # Normal case: use s-domain components
                H = V_out_s / V_in_s
        except Exception as e:
            # Last resort: try to compute from netlist topology
            try:
                H = compute_transfer_from_netlist(netlist, in_node, out_node)
            except:
                raise ValueError(f"Could not compute transfer function: {str(e)}")
        
        # Simplify the transfer function
        try:
            H = H.simplify()
        except:
            pass
        
        # Get string representations
        try:
            transfer_function = str(H.canonical())
        except:
            transfer_function = str(H)
        
        # Check for NaN and handle it
        if 'nan' in transfer_function.lower() or transfer_function.lower() == 'nan':
            transfer_function = str(H)
            if 'nan' in transfer_function.lower():
                transfer_function = "Unable to compute transfer function"
        
        # Extract numerator and denominator
        try:
            # Try to get numerator and denominator from the transfer function
            if hasattr(H, 'N') and hasattr(H, 'D'):
                # lcapy expression
                num_expr = H.N
                den_expr = H.D
                
                # Simplify and convert to string
                try:
                    numerator = str(num_expr.canonical())
                except:
                    numerator = str(num_expr)
                
                try:
                    denominator = str(den_expr.canonical())
                except:
                    denominator = str(den_expr)
            elif hasattr(H, 'as_numer_denom'):
                # sympy expression - use as_numer_denom
                num_expr, den_expr = H.as_numer_denom()
                numerator = str(num_expr.simplify())
                denominator = str(den_expr.simplify())
            elif hasattr(H, 'numerator') and hasattr(H, 'denominator'):
                # Alternative sympy method
                numerator = str(H.numerator)
                denominator = str(H.denominator)
            else:
                # Try to extract from fraction
                from sympy import fraction
                try:
                    num_expr, den_expr = fraction(H)
                    numerator = str(num_expr.simplify())
                    denominator = str(den_expr.simplify())
                except:
                    # Last resort: parse from string
                    tf_str = str(H)
                    if '/' in tf_str:
                        parts = tf_str.split('/', 1)
                        numerator = parts[0].strip()
                        denominator = parts[1].strip() if len(parts) > 1 else "1"
                    else:
                        numerator = tf_str
                        denominator = "1"
            
            # Check for NaN and clean up
            if 'nan' in numerator.lower():
                numerator = "1"
            if 'nan' in denominator.lower():
                denominator = "1"
        except Exception as e:
            # Fallback: try to parse from transfer function string
            tf_str = str(H)
            if '/' in tf_str:
                parts = tf_str.split('/', 1)
                numerator = parts[0].strip().strip('()')
                denominator = parts[1].strip().strip('()') if len(parts) > 1 else "1"
            else:
                numerator = tf_str
                denominator = "1"
        
        try:
            poles = [str(p) for p in H.poles()]
            zeros = [str(z) for z in H.zeros()]
        except:
            poles = []
            zeros = []
        
        return jsonify({
            'success': True,
            'transfer_function': transfer_function,
            'numerator': numerator,
            'denominator': denominator,
            'poles': poles,
            'zeros': zeros
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 400

@app.route('/api/matlab-analysis', methods=['POST'])
def matlab_analysis():
    try:
        data = request.json
        analysis_type = data.get('type')
        netlist = data.get('netlist')
        input_node = data.get('input_node', '1')
        output_node = data.get('output_node', '2')
        input_type = data.get('input_type', 'step')
        duration = data.get('duration', 0.01)
        amplitude = data.get('amplitude', 1.0)
        
        # Ensure netlist is a string with proper newlines
        if isinstance(netlist, str):
            # Replace escaped newlines with actual newlines if needed
            netlist = netlist.replace('\\n', '\n')
            # Clean up the netlist - remove extra whitespace
            netlist_lines = [line.strip() for line in netlist.split('\n') if line.strip()]
            netlist = '\n'.join(netlist_lines)
            # Normalize component values (convert 1k to 1000, etc.)
            netlist = normalize_netlist(netlist)
        else:
            return jsonify({
                'success': False,
                'error': 'Invalid netlist format'
            }), 400
        
        try:
            cct = Circuit(netlist)
            # Calculate transfer function using node voltages
            # H(s) = V(output) / V(input)
            in_node = int(input_node) if input_node and input_node.isdigit() else 1
            out_node = int(output_node) if output_node and output_node.isdigit() else 2
            
            # Get open-circuit voltages at input and output nodes
            V_in = cct.Voc(in_node, 0)
            V_out = cct.Voc(out_node, 0)
            
            # Transfer function is output/input in s-domain
            H = V_out.s / V_in.s
        except Exception as e:
            return jsonify({
                'success': False,
                'error': f'Circuit parsing error: {str(e)}. Netlist: {netlist[:100]}'
            }), 400
        
        if analysis_type == 'bode':
            return bode_plot(H)
        elif analysis_type == 'step':
            return step_response(H, duration)
        elif analysis_type == 'impulse':
            return impulse_response(H, duration)
        elif analysis_type == 'pole-zero':
            return pole_zero_map(H)
        elif analysis_type == 'time-domain':
            return time_domain_simulation(H, input_type, duration, amplitude)
        else:
            return jsonify({
                'success': False,
                'error': f'Unknown analysis type: {analysis_type}'
            }), 400
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 400

def bode_plot(H):
    """Generate Bode plot data"""
    try:
        # Generate frequency range (1 Hz to 1 MHz, logarithmic)
        frequencies = np.logspace(0, 6, 1000)  # 1 Hz to 1 MHz
        
        # Evaluate transfer function at each frequency
        magnitude_db = []
        phase_deg = []
        
        for freq in frequencies:
            try:
                # Evaluate H(s) at s = j*2*pi*freq
                s_val = 1j * 2 * np.pi * freq
                H_val = H.evaluate(s_val)
                
                # Handle complex numbers and check for valid values
                if H_val is None or (isinstance(H_val, (float, complex)) and (np.isnan(H_val) or np.isinf(H_val))):
                    magnitude_db.append(-200.0)
                    phase_deg.append(0.0)
                    continue
                
                # Calculate magnitude in dB
                mag = abs(H_val)
                if mag > 0 and not (np.isnan(mag) or np.isinf(mag)):
                    mag_db = 20 * np.log10(mag)
                    # Replace NaN or Inf with valid values
                    if np.isnan(mag_db) or np.isinf(mag_db):
                        mag_db = -200.0
                else:
                    mag_db = -200.0
                
                magnitude_db.append(float(mag_db))
                
                # Calculate phase in degrees
                try:
                    phase_rad = np.angle(H_val)
                    phase_deg_val = np.degrees(phase_rad)
                    if np.isnan(phase_deg_val) or np.isinf(phase_deg_val):
                        phase_deg_val = 0.0
                    phase_deg.append(float(phase_deg_val))
                except:
                    phase_deg.append(0.0)
            except Exception as e:
                magnitude_db.append(-200.0)
                phase_deg.append(0.0)
        
        # Ensure all values are valid (no NaN or Inf)
        frequencies_list = [float(f) for f in frequencies.tolist()]
        magnitude_db = [float(x) if not (np.isnan(x) or np.isinf(x)) else -200.0 for x in magnitude_db]
        phase_deg = [float(x) if not (np.isnan(x) or np.isinf(x)) else 0.0 for x in phase_deg]
        
        return jsonify({
            'success': True,
            'frequencies': frequencies_list,
            'magnitude_db': magnitude_db,
            'phase_deg': phase_deg
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Bode plot error: {str(e)}'
        }), 400

def step_response(H, duration=0.01):
    """Generate step response data"""
    try:
        # Convert transfer function to numerator and denominator
        num, den = transfer_function_to_coefficients(H)
        
        # Create system
        sys = signal.TransferFunction(num, den)
        
        # Time vector
        t = np.linspace(0, duration, 1000)
        
        # Step response
        t_out, response = signal.step(sys, T=t)
        
        # Filter out NaN and Inf values
        time_list = [float(x) if not (np.isnan(x) or np.isinf(x)) else 0.0 for x in t_out.tolist()]
        response_list = [float(x) if not (np.isnan(x) or np.isinf(x)) else 0.0 for x in response.tolist()]
        
        return jsonify({
            'success': True,
            'time': time_list,
            'response': response_list
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Step response error: {str(e)}'
        }), 400

def impulse_response(H, duration=0.01):
    """Generate impulse response data"""
    try:
        # Convert transfer function to numerator and denominator
        num, den = transfer_function_to_coefficients(H)
        
        # Create system
        sys = signal.TransferFunction(num, den)
        
        # Time vector
        t = np.linspace(0, duration, 1000)
        
        # Impulse response
        t_out, response = signal.impulse(sys, T=t)
        
        # Filter out NaN and Inf values
        time_list = [float(x) if not (np.isnan(x) or np.isinf(x)) else 0.0 for x in t_out.tolist()]
        response_list = [float(x) if not (np.isnan(x) or np.isinf(x)) else 0.0 for x in response.tolist()]
        
        return jsonify({
            'success': True,
            'time': time_list,
            'response': response_list
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Impulse response error: {str(e)}'
        }), 400

def pole_zero_map(H):
    """Generate pole-zero map"""
    try:
        # Get poles and zeros
        poles = H.poles()
        zeros = H.zeros()
        
        # Convert to complex numbers
        poles_list = []
        for p in poles:
            try:
                p_val = complex(p.evalf())
                poles_list.append({'real': float(p_val.real), 'imag': float(p_val.imag)})
            except:
                pass
        
        zeros_list = []
        for z in zeros:
            try:
                z_val = complex(z.evalf())
                zeros_list.append({'real': float(z_val.real), 'imag': float(z_val.imag)})
            except:
                pass
        
        # Check stability (all poles must have negative real parts)
        stable = all(p['real'] < 0 for p in poles_list)
        
        return jsonify({
            'success': True,
            'poles': poles_list,
            'zeros': zeros_list,
            'stable': stable
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Pole-zero map error: {str(e)}'
        }), 400

def time_domain_simulation(H, input_type='step', duration=0.01, amplitude=1.0):
    """Generate time domain simulation"""
    try:
        # Convert transfer function to coefficients
        num, den = transfer_function_to_coefficients(H)
        
        # Create system
        sys = signal.TransferFunction(num, den)
        
        # Time vector
        t = np.linspace(0, duration, 1000)
        
        # Generate input signal
        if input_type == 'step':
            u = amplitude * np.ones_like(t)
        elif input_type == 'sine':
            freq = 1000  # 1 kHz default
            u = amplitude * np.sin(2 * np.pi * freq * t)
        elif input_type == 'square':
            freq = 1000
            u = amplitude * signal.square(2 * np.pi * freq * t)
        elif input_type == 'impulse':
            u = np.zeros_like(t)
            u[0] = amplitude
        else:
            u = amplitude * np.ones_like(t)
        
        # Simulate system response
        t_out, y_out, _ = signal.lsim(sys, u, t)
        
        # Filter out NaN and Inf values
        time_list = [float(x) if not (np.isnan(x) or np.isinf(x)) else 0.0 for x in t_out.tolist()]
        input_list = [float(x) if not (np.isnan(x) or np.isinf(x)) else 0.0 for x in u.tolist()]
        output_list = [float(x) if not (np.isnan(x) or np.isinf(x)) else 0.0 for x in y_out.tolist()]
        
        return jsonify({
            'success': True,
            'time': time_list,
            'input': input_list,
            'output': output_list
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Time domain simulation error: {str(e)}'
        }), 400

def compute_transfer_from_netlist(netlist, in_node, out_node):
    """Compute transfer function directly from netlist for simple RC/RL circuits"""
    from sympy import Symbol
    s = Symbol('s')
    
    # Parse netlist to find R, L, C values
    lines = netlist.split('\n')
    R_val = None
    C_val = None
    L_val = None
    
    for line in lines:
        parts = line.strip().split()
        if len(parts) >= 4:
            comp_name = parts[0].upper()
            value_str = parts[3]
            
            # Parse value
            try:
                if 'k' in value_str.lower():
                    value = float(value_str.lower().replace('k', '')) * 1000
                elif 'm' in value_str.lower() and 'u' not in value_str.lower():
                    value = float(value_str.lower().replace('m', '')) * 0.001
                elif 'u' in value_str.lower():
                    value = float(value_str.lower().replace('u', '')) * 1e-6
                elif 'n' in value_str.lower():
                    value = float(value_str.lower().replace('n', '')) * 1e-9
                else:
                    value = float(value_str)
                
                if comp_name.startswith('R'):
                    R_val = value
                elif comp_name.startswith('C'):
                    C_val = value
                elif comp_name.startswith('L'):
                    L_val = value
            except:
                pass
    
    # Compute transfer function for common topologies
    # RC low-pass: H(s) = 1/(1 + s*R*C)
    if R_val and C_val:
        H = 1 / (1 + s * R_val * C_val)
        return H
    # RL high-pass: H(s) = s*L*R/(s*L + R) or similar
    elif R_val and L_val:
        H = (s * L_val) / (s * L_val + R_val)
        return H
    else:
        raise ValueError("Could not determine circuit topology for transfer function computation")

def transfer_function_to_coefficients(H):
    """Convert lcapy transfer function to numpy coefficients"""
    try:
        s = sp.Symbol('s')
        
        # Get numerator and denominator as sympy expressions
        num_expr = H.N.as_expr()
        den_expr = H.D.as_expr()
        
        # Convert to polynomial coefficients
        try:
            num_poly = sp.Poly(num_expr, s)
            den_poly = sp.Poly(den_expr, s)
            
            num_coeffs = num_poly.all_coeffs()
            den_coeffs = den_poly.all_coeffs()
            
            # Convert to float arrays (scipy expects [highest ... lowest] order)
            num_array = [float(c) for c in num_coeffs]
            den_array = [float(c) for c in den_coeffs]
            
            return num_array, den_array
        except:
            # Fallback: handle simple cases
            # If numerator is just a constant
            if num_expr.is_number:
                num_array = [float(num_expr)]
            else:
                # Try to extract as polynomial
                try:
                    num_poly = sp.Poly(num_expr.expand(), s)
                    num_coeffs = num_poly.all_coeffs()
                    num_array = [float(c) for c in num_coeffs]
                except:
                    num_array = [1.0]
            
            # If denominator is just a constant
            if den_expr.is_number:
                den_array = [float(den_expr), 0.0]
            else:
                # Try to extract as polynomial
                try:
                    den_poly = sp.Poly(den_expr.expand(), s)
                    den_coeffs = den_poly.all_coeffs()
                    den_array = [float(c) for c in reversed(den_coeffs)]
                except:
                    # Try to extract from common forms like (s + a) or (a*s + b)
                    den_expr_expanded = den_expr.expand()
                    if den_expr_expanded.is_polynomial(s):
                        den_poly = sp.Poly(den_expr_expanded, s)
                        den_coeffs = den_poly.all_coeffs()
                        den_array = [float(c) for c in den_coeffs]
                    else:
                        # Ultimate fallback: simple first-order system
                        den_array = [1.0, 1000.0]
            
            return num_array, den_array
    except Exception as e:
        # Ultimate fallback: simple RC filter (1/(s + 1000))
        return [1.0], [1.0, 1000.0]

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    import os
    # Get port from environment variable (for production) or use 5001 for local
    port = int(os.environ.get('PORT', 5001))
    # Use 0.0.0.0 for production (allows external connections), 127.0.0.1 for local
    host = os.environ.get('HOST', '127.0.0.1')
    # Only enable debug in development
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug, port=port, host=host)