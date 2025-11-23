'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, TrendingUp, Radio, Zap, MapPin, Clock, Sliders, Shield, Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ReferenceLine } from 'recharts';

interface MatlabAnalysisProps {
  netlist: string;
  inputNode: string;
  outputNode: string;
  transferFunctionResult?: any;
}

interface ComponentValue {
  name: string;
  type: 'R' | 'L' | 'C';
  currentValue: number;
  min: number;
  max: number;
  unit: string;
}

export default function MatlabAnalysis({ netlist, inputNode, outputNode, transferFunctionResult }: MatlabAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [bodeData, setBodeData] = useState<any>(null);
  const [stepData, setStepData] = useState<any>(null);
  const [impulseData, setImpulseData] = useState<any>(null);
  const [poleZeroData, setPoleZeroData] = useState<any>(null);
  const [timeDomainData, setTimeDomainData] = useState<any>(null);
  const [stabilityData, setStabilityData] = useState<any>(null);
  const [error, setError] = useState('');
  const [componentValues, setComponentValues] = useState<ComponentValue[]>([]);
  const [modifiedNetlist, setModifiedNetlist] = useState(netlist);
  const [timeDomainInput, setTimeDomainInput] = useState('step'); // step, sine, square, custom
  const [timeDomainDuration, setTimeDomainDuration] = useState(0.01);
  const [timeDomainAmplitude, setTimeDomainAmplitude] = useState(1);

  // Parse netlist to extract component values
  useEffect(() => {
    if (netlist) {
      const lines = netlist.split('\n').filter(line => line.trim());
      const components: ComponentValue[] = [];
      
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 4) {
          const name = parts[0];
          const valueStr = parts[3];
          
          // Determine component type
          let type: 'R' | 'L' | 'C' = 'R';
          if (name.startsWith('R')) type = 'R';
          else if (name.startsWith('L')) type = 'L';
          else if (name.startsWith('C')) type = 'C';
          
          // Parse value (handle units like 1k, 1u, 10m)
          let value = parseValue(valueStr);
          let unit = getUnit(valueStr);
          
          if (value > 0) {
            components.push({
              name,
              type,
              currentValue: value,
              min: value * 0.1,
              max: value * 10,
              unit
            });
          }
        }
      });
      
      setComponentValues(components);
      setModifiedNetlist(netlist);
    }
  }, [netlist]);

  // Helper function to parse component values
  const parseValue = (valueStr: string): number => {
    const num = parseFloat(valueStr);
    if (isNaN(num)) return 0;
    
    const lower = valueStr.toLowerCase();
    if (lower.includes('k')) return num * 1000;
    if (lower.includes('m') && !lower.includes('u')) return num * 0.001;
    if (lower.includes('u')) return num * 0.000001;
    if (lower.includes('n')) return num * 0.000000001;
    if (lower.includes('p')) return num * 0.000000000001;
    return num;
  };

  const getUnit = (valueStr: string): string => {
    const lower = valueStr.toLowerCase();
    if (lower.includes('k')) return 'kΩ';
    if (lower.includes('m') && !lower.includes('u')) return 'mH';
    if (lower.includes('u')) return 'μF';
    if (lower.includes('n')) return 'nF';
    if (lower.includes('p')) return 'pF';
    return 'Ω';
  };

  const formatValue = (value: number, unit: string): string => {
    if (unit.includes('Ω')) {
      if (value >= 1000) return `${(value / 1000).toFixed(2)}k`;
      return value.toFixed(2);
    }
    if (unit.includes('H')) {
      if (value >= 1) return `${value.toFixed(3)}`;
      if (value >= 0.001) return `${(value * 1000).toFixed(2)}m`;
      return `${(value * 1000000).toFixed(2)}u`;
    }
    if (unit.includes('F')) {
      if (value >= 0.001) return `${(value * 1000).toFixed(2)}m`;
      if (value >= 0.000001) return `${(value * 1000000).toFixed(2)}u`;
      if (value >= 0.000000001) return `${(value * 1000000000).toFixed(2)}n`;
      return `${(value * 1000000000000).toFixed(2)}p`;
    }
    return value.toFixed(2);
  };

  // Update netlist when component values change
  const updateComponentValue = (index: number, newValue: number[]) => {
    const updated = [...componentValues];
    updated[index].currentValue = newValue[0];
    setComponentValues(updated);
    
    // Update netlist
    const lines = netlist.split('\n');
    const component = updated[index];
    const formattedValue = formatValue(component.currentValue, component.unit);
    
    const updatedLines = lines.map(line => {
      if (line.trim().startsWith(component.name)) {
        const parts = line.trim().split(/\s+/);
        parts[3] = formattedValue;
        return parts.join(' ');
      }
      return line;
    });
    
    setModifiedNetlist(updatedLines.join('\n'));
  };

  const runBodeAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/matlab-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bode',
          netlist: modifiedNetlist,
          input_node: inputNode,
          output_node: outputNode
        })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        setError(errorData.error || `Server error: ${response.status}`);
        return;
      }
      
      const data = await response.json();
      if (data.success) {
        setBodeData(data);
      } else {
        setError(data.error || 'Failed to calculate Bode plot');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to calculate Bode plot. Make sure Python server is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  const runStepResponse = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/matlab-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'step',
          netlist: modifiedNetlist,
          input_node: inputNode,
          output_node: outputNode
        })
      });
      const data = await response.json();
      if (data.success) {
        setStepData(data);
      } else {
        setError(data.error || 'Failed to calculate step response');
      }
    } catch (err) {
      setError('Failed to calculate step response. Make sure Python server is running.');
    } finally {
      setLoading(false);
    }
  };

  const runImpulseResponse = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/matlab-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'impulse',
          netlist: modifiedNetlist,
          input_node: inputNode,
          output_node: outputNode
        })
      });
      const data = await response.json();
      if (data.success) {
        setImpulseData(data);
      } else {
        setError(data.error || 'Failed to calculate impulse response');
      }
    } catch (err) {
      setError('Failed to calculate impulse response. Make sure Python server is running.');
    } finally {
      setLoading(false);
    }
  };

  const runPoleZeroMap = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/matlab-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'pole-zero',
          netlist: modifiedNetlist,
          input_node: inputNode,
          output_node: outputNode
        })
      });
      const data = await response.json();
      if (data.success) {
        setPoleZeroData(data);
        // Also update stability analysis
        analyzeStability(data);
      } else {
        setError(data.error || 'Failed to calculate pole-zero map');
      }
    } catch (err) {
      setError('Failed to calculate pole-zero map. Make sure Python server is running.');
    } finally {
      setLoading(false);
    }
  };

  const runTimeDomainSimulation = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/matlab-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'time-domain',
          netlist: modifiedNetlist,
          input_node: inputNode,
          output_node: outputNode,
          input_type: timeDomainInput,
          duration: timeDomainDuration,
          amplitude: timeDomainAmplitude
        })
      });
      const data = await response.json();
      if (data.success) {
        setTimeDomainData(data);
      } else {
        setError(data.error || 'Failed to calculate time domain simulation');
      }
    } catch (err) {
      setError('Failed to calculate time domain simulation. Make sure Python server is running.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeStability = (poleZeroData: any) => {
    if (!poleZeroData || !poleZeroData.poles) return;
    
    const poles = poleZeroData.poles;
    const hasUnstablePoles = poles.some((p: any) => p.real > 0);
    const dominantPole = poles.reduce((prev: any, curr: any) => 
      curr.real < prev.real ? curr : prev
    );
    
    const dampingRatio = dominantPole ? 
      -dominantPole.real / Math.sqrt(dominantPole.real ** 2 + dominantPole.imag ** 2) : 0;
    
    const naturalFrequency = dominantPole ? 
      Math.sqrt(dominantPole.real ** 2 + dominantPole.imag ** 2) : 0;
    
    setStabilityData({
      stable: !hasUnstablePoles,
      dominantPole,
      dampingRatio,
      naturalFrequency,
      allPoles: poles
    });
  };

  // Export functions
  const exportAsImage = (chartId: string, filename: string) => {
    const element = document.getElementById(chartId);
    if (!element) return;
    
    // Image export requires html2canvas package
    // For now, we'll show a message to install it
    alert('Image export requires html2canvas package. Please install it with: npm install html2canvas\n\nAlternatively, you can use CSV or JSON export which are available now.');
    
    // Uncomment below after installing html2canvas:
    // import('html2canvas').then((html2canvas: any) => {
    //   html2canvas.default(element).then((canvas: HTMLCanvasElement) => {
    //     const link = document.createElement('a');
    //     link.download = `${filename}.png`;
    //     link.href = canvas.toDataURL();
    //     link.click();
    //   });
    // }).catch(() => {
    //   alert('Failed to export image. Please ensure html2canvas is installed.');
    // });
  };

  const exportAsCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  const exportAsJSON = (data: any, filename: string) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Component Value Sliders */}
      {componentValues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sliders className="h-5 w-5" />
              Component Value Adjustments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Adjust component values and see real-time changes in the transfer function
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {componentValues.map((component, index) => (
                <div key={component.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">
                      {component.name} ({component.type})
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {component.currentValue.toFixed(4)} {component.unit}
                    </span>
                  </div>
                  <Slider
                    value={[component.currentValue]}
                    min={component.min}
                    max={component.max}
                    step={component.max / 1000}
                    onValueChange={(value) => updateComponentValue(index, value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatValue(component.min, component.unit)}</span>
                    <span>{formatValue(component.max, component.unit)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-2">Modified Netlist:</p>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                {modifiedNetlist}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="bode" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="bode">
            <TrendingUp className="h-4 w-4 mr-2" />
            Bode Plot
          </TabsTrigger>
          <TabsTrigger value="step">
            <Zap className="h-4 w-4 mr-2" />
            Step Response
          </TabsTrigger>
          <TabsTrigger value="impulse">
            <Radio className="h-4 w-4 mr-2" />
            Impulse
          </TabsTrigger>
          <TabsTrigger value="pz">
            <MapPin className="h-4 w-4 mr-2" />
            Pole-Zero
          </TabsTrigger>
          <TabsTrigger value="time">
            <Clock className="h-4 w-4 mr-2" />
            Time Domain
          </TabsTrigger>
          <TabsTrigger value="stability">
            <Shield className="h-4 w-4 mr-2" />
            Stability
          </TabsTrigger>
        </TabsList>

        {/* Bode Plot */}
        <TabsContent value="bode">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Bode Plot (Frequency Response)</CardTitle>
                {bodeData && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => exportAsCSV(
                      bodeData.frequencies?.map((f: number, i: number) => ({
                        frequency: f,
                        magnitude_db: bodeData.magnitude_db[i],
                        phase_deg: bodeData.phase_deg[i]
                      })) || [],
                      'bode_plot'
                    )}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => exportAsJSON(bodeData, 'bode_plot')}>
                      <FileJson className="h-4 w-4 mr-2" />
                      JSON
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runBodeAnalysis} disabled={loading || !modifiedNetlist}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Calculate Bode Plot
              </Button>

              {bodeData && (
                <div className="space-y-6">
                  {/* Magnitude Plot */}
                  <div id="bode-magnitude">
                    <h3 className="text-sm font-semibold mb-2">Magnitude (dB)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={bodeData.frequencies?.map((f: number, i: number) => ({
                        freq: f,
                        mag: bodeData.magnitude_db[i]
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="freq" scale="log" domain={['auto', 'auto']} label={{ value: 'Frequency (Hz)', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Magnitude (dB)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="mag" stroke="#8884d8" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Phase Plot */}
                  <div id="bode-phase">
                    <h3 className="text-sm font-semibold mb-2">Phase (degrees)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={bodeData.frequencies?.map((f: number, i: number) => ({
                        freq: f,
                        phase: bodeData.phase_deg[i]
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="freq" scale="log" domain={['auto', 'auto']} label={{ value: 'Frequency (Hz)', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Phase (°)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="phase" stroke="#82ca9d" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step Response */}
        <TabsContent value="step">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Step Response</CardTitle>
                {stepData && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => exportAsCSV(
                      stepData.time?.map((t: number, i: number) => ({
                        time: t,
                        response: stepData.response[i]
                      })) || [],
                      'step_response'
                    )}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => exportAsJSON(stepData, 'step_response')}>
                      <FileJson className="h-4 w-4 mr-2" />
                      JSON
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runStepResponse} disabled={loading || !modifiedNetlist}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Calculate Step Response
              </Button>

              {stepData && (
                <div id="step-response">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={stepData.time?.map((t: number, i: number) => ({
                      time: t,
                      response: stepData.response[i]
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="response" stroke="#8884d8" name="Output" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Impulse Response */}
        <TabsContent value="impulse">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Impulse Response</CardTitle>
                {impulseData && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => exportAsCSV(
                      impulseData.time?.map((t: number, i: number) => ({
                        time: t,
                        response: impulseData.response[i]
                      })) || [],
                      'impulse_response'
                    )}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => exportAsJSON(impulseData, 'impulse_response')}>
                      <FileJson className="h-4 w-4 mr-2" />
                      JSON
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runImpulseResponse} disabled={loading || !modifiedNetlist}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Calculate Impulse Response
              </Button>

              {impulseData && (
                <div id="impulse-response">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={impulseData.time?.map((t: number, i: number) => ({
                      time: t,
                      response: impulseData.response[i]
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="response" stroke="#82ca9d" name="Output" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pole-Zero Map */}
        <TabsContent value="pz">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Pole-Zero Map</CardTitle>
                {poleZeroData && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => exportAsJSON(poleZeroData, 'pole_zero_map')}>
                      <FileJson className="h-4 w-4 mr-2" />
                      JSON
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runPoleZeroMap} disabled={loading || !modifiedNetlist}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Calculate Pole-Zero Map
              </Button>

              {poleZeroData && (
                <div className="space-y-4">
                  <div className={`p-3 rounded ${poleZeroData.stable ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`font-semibold ${poleZeroData.stable ? 'text-green-800' : 'text-red-800'}`}>
                      System is {poleZeroData.stable ? 'STABLE' : 'UNSTABLE'}
                    </p>
                  </div>

                  <div id="pole-zero-plot">
                    <ResponsiveContainer width="100%" height={400}>
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid />
                        <XAxis type="number" dataKey="real" name="Real" label={{ value: 'Real Axis', position: 'insideBottom', offset: -5 }} />
                        <YAxis type="number" dataKey="imag" name="Imaginary" label={{ value: 'Imaginary Axis', angle: -90, position: 'insideLeft' }} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Legend />
                        <ReferenceLine x={0} stroke="#666" />
                        <ReferenceLine y={0} stroke="#666" />
                        <Scatter name="Poles" data={poleZeroData.poles} fill="#ff0000" shape="cross" />
                        <Scatter name="Zeros" data={poleZeroData.zeros} fill="#0000ff" shape="circle" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold">Poles:</p>
                      <ul className="list-disc list-inside">
                        {poleZeroData.poles?.map((p: any, i: number) => (
                          <li key={i}>{p.real.toFixed(2)} + {p.imag.toFixed(2)}i</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold">Zeros:</p>
                      <ul className="list-disc list-inside">
                        {poleZeroData.zeros?.map((z: any, i: number) => (
                          <li key={i}>{z.real.toFixed(2)} + {z.imag.toFixed(2)}i</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time Domain Simulation */}
        <TabsContent value="time">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Time Domain Simulation</CardTitle>
                {timeDomainData && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => exportAsCSV(
                      timeDomainData.time?.map((t: number, i: number) => ({
                        time: t,
                        input: timeDomainData.input?.[i] || 0,
                        output: timeDomainData.output[i]
                      })) || [],
                      'time_domain'
                    )}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => exportAsJSON(timeDomainData, 'time_domain')}>
                      <FileJson className="h-4 w-4 mr-2" />
                      JSON
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Input Type</Label>
                  <select
                    value={timeDomainInput}
                    onChange={(e) => setTimeDomainInput(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  >
                    <option value="step">Step</option>
                    <option value="sine">Sine Wave</option>
                    <option value="square">Square Wave</option>
                    <option value="impulse">Impulse</option>
                  </select>
                </div>
                <div>
                  <Label>Duration (s)</Label>
                  <Input
                    type="number"
                    value={timeDomainDuration}
                    onChange={(e) => setTimeDomainDuration(parseFloat(e.target.value) || 0.01)}
                    min="0.001"
                    max="1"
                    step="0.001"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Amplitude</Label>
                  <Input
                    type="number"
                    value={timeDomainAmplitude}
                    onChange={(e) => setTimeDomainAmplitude(parseFloat(e.target.value) || 1)}
                    min="0.1"
                    max="10"
                    step="0.1"
                    className="mt-1"
                  />
                </div>
              </div>
              <Button onClick={runTimeDomainSimulation} disabled={loading || !modifiedNetlist}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Run Time Domain Simulation
              </Button>

              {timeDomainData && (
                <div id="time-domain">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={timeDomainData.time?.map((t: number, i: number) => ({
                      time: t,
                      input: timeDomainData.input?.[i] || 0,
                      output: timeDomainData.output[i]
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="input" stroke="#8884d8" name="Input" />
                      <Line type="monotone" dataKey="output" stroke="#82ca9d" name="Output" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stability Analysis */}
        <TabsContent value="stability">
          <Card>
            <CardHeader>
              <CardTitle>Stability Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runPoleZeroMap} disabled={loading || !modifiedNetlist}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Analyze Stability
              </Button>

              {stabilityData && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border-2 ${stabilityData.stable ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className={`h-5 w-5 ${stabilityData.stable ? 'text-green-700' : 'text-red-700'}`} />
                      <h3 className={`text-lg font-bold ${stabilityData.stable ? 'text-green-800' : 'text-red-800'}`}>
                        System is {stabilityData.stable ? 'STABLE' : 'UNSTABLE'}
                      </h3>
                    </div>
                    {!stabilityData.stable && (
                      <p className="text-sm text-red-700 mt-2">
                        ⚠️ System has poles in the right half-plane. This system will not settle to a steady state.
                      </p>
                    )}
                  </div>

                  {stabilityData.dominantPole && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Dominant Pole</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-mono">
                            {stabilityData.dominantPole.real.toFixed(4)} + {stabilityData.dominantPole.imag.toFixed(4)}i
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Real part: {stabilityData.dominantPole.real.toFixed(4)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Imaginary part: {stabilityData.dominantPole.imag.toFixed(4)}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">System Characteristics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">Damping Ratio (ζ):</span>
                            <span className="ml-2 font-mono">{stabilityData.dampingRatio.toFixed(4)}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Natural Frequency (ωₙ):</span>
                            <span className="ml-2 font-mono">{stabilityData.naturalFrequency.toFixed(4)} rad/s</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Settling Time (2%):</span>
                            <span className="ml-2 font-mono">
                              {stabilityData.dominantPole.real !== 0 
                                ? (4 / Math.abs(stabilityData.dominantPole.real)).toFixed(4) + ' s'
                                : '∞'}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">All Poles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {stabilityData.allPoles?.map((pole: any, i: number) => (
                          <div key={i} className="text-sm font-mono p-2 bg-muted rounded">
                            {pole.real.toFixed(4)} + {pole.imag.toFixed(4)}i
                            {pole.real > 0 && <span className="text-red-600 ml-2">⚠️</span>}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {poleZeroData && !stabilityData && (
                <div className="text-sm text-muted-foreground">
                  Click "Analyze Stability" to see detailed stability information
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
