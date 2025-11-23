'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { convertCircuitToNetlist, getInputOutputNodes } from './CircuitToNetlist';

interface Component {
  id: string
  type: string
  name: string
  x: number
  y: number
  rotation: number
  value?: string
  connections: string[]
}

interface TransferFunctionCalculatorProps {
  components?: Component[];
}

export default function TransferFunctionCalculator({ components: externalComponents }: TransferFunctionCalculatorProps) {
  const [netlist, setNetlist] = useState(`V1 1 0 ac
R1 1 2 1k
C1 2 0 1u`);
  const [inputNode, setInputNode] = useState('1');
  const [outputNode, setOutputNode] = useState('2');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoMode, setAutoMode] = useState(false);

  // Listen for circuit updates from CircuitSimulator
  useEffect(() => {
    const handleCircuitUpdate = (event: any) => {
      if (event.detail && event.detail.components) {
        const circuitNetlist = convertCircuitToNetlist(event.detail.components);
        if (circuitNetlist) {
          setNetlist(circuitNetlist);
          const nodes = getInputOutputNodes(event.detail.components);
          setInputNode(nodes.input);
          setOutputNode(nodes.output);
          setAutoMode(true);
          // Emit netlist update event
          window.dispatchEvent(new CustomEvent('netlist-updated', {
            detail: {
              netlist: circuitNetlist,
              inputNode: nodes.input,
              outputNode: nodes.output
            }
          }));
        }
      }
    };

    window.addEventListener('circuit-updated', handleCircuitUpdate);
    return () => window.removeEventListener('circuit-updated', handleCircuitUpdate);
  }, []);

  // If components are passed as props, convert them
  useEffect(() => {
    if (externalComponents && externalComponents.length > 0) {
      const circuitNetlist = convertCircuitToNetlist(externalComponents);
      if (circuitNetlist) {
        setNetlist(circuitNetlist);
        const nodes = getInputOutputNodes(externalComponents);
        setInputNode(nodes.input);
        setOutputNode(nodes.output);
        setAutoMode(true);
        // Emit netlist update event
        window.dispatchEvent(new CustomEvent('netlist-updated', {
          detail: {
            netlist: circuitNetlist,
            inputNode: nodes.input,
            outputNode: nodes.output
          }
        }));
      }
    }
  }, [externalComponents]);

  // Emit initial netlist on mount
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('netlist-updated', {
      detail: {
        netlist,
        inputNode,
        outputNode
      }
    }));
  }, []); // Only on mount

  const calculateTransferFunction = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await fetch('/api/transfer-function', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          netlist,
          input_node: inputNode,
          output_node: outputNode
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
        // Emit event for MATLAB analysis component
        window.dispatchEvent(new CustomEvent('transfer-function-calculated', {
          detail: {
            netlist,
            inputNode,
            outputNode,
            result: data
          }
        }));
      }
    } catch (err) {
      setError('Failed to connect to backend. Make sure Python server is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 w-full">
      <div>
        <h1 className="text-3xl font-bold">Transfer Function Calculator</h1>
        <p className="text-gray-600 mt-2">
          {autoMode 
            ? 'Automatically generated from circuit above' 
            : 'Calculate transfer functions for electrical circuits using SPICE netlist format'}
        </p>
      </div>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Circuit Netlist</h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">
                Netlist (SPICE format)
              </label>
              {autoMode && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setAutoMode(false)}
                >
                  Edit Manually
                </Button>
              )}
            </div>
            <Textarea
              value={netlist}
              onChange={(e) => {
                const newNetlist = e.target.value;
                setNetlist(newNetlist);
                setAutoMode(false);
                // Emit netlist update event
                window.dispatchEvent(new CustomEvent('netlist-updated', {
                  detail: {
                    netlist: newNetlist,
                    inputNode,
                    outputNode
                  }
                }));
              }}
              rows={8}
              className="font-mono text-sm"
              placeholder="Enter circuit netlist..."
              disabled={autoMode}
            />
            <p className="text-xs text-gray-500 mt-2">
              {autoMode 
                ? 'This netlist was automatically generated from your circuit. Click "Edit Manually" to modify it.'
                : 'Format: ComponentName Node1 Node2 Value (e.g., R1 1 2 1k)'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Input Node
              </label>
              <input
                type="text"
                value={inputNode}
                onChange={(e) => {
                  const newInputNode = e.target.value;
                  setInputNode(newInputNode);
                  window.dispatchEvent(new CustomEvent('netlist-updated', {
                    detail: {
                      netlist,
                      inputNode: newInputNode,
                      outputNode
                    }
                  }));
                }}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="1"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Output Node
              </label>
              <input
                type="text"
                value={outputNode}
                onChange={(e) => {
                  const newOutputNode = e.target.value;
                  setOutputNode(newOutputNode);
                  window.dispatchEvent(new CustomEvent('netlist-updated', {
                    detail: {
                      netlist,
                      inputNode,
                      outputNode: newOutputNode
                    }
                  }));
                }}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="2"
              />
            </div>
          </div>
          
          <Button 
            onClick={calculateTransferFunction} 
            disabled={loading || !netlist.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              'Calculate Transfer Function'
            )}
          </Button>
        </div>
      </Card>

      {error && (
        <Card className="p-4 border-red-500 bg-red-50">
          <p className="text-red-700 font-semibold">Error:</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </Card>
      )}

      {result && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Results</h3>
          <div className="space-y-4">
            <div>
              <strong className="text-sm font-medium text-gray-700">Transfer Function H(s):</strong>
              <div className="font-mono bg-gray-100 p-4 rounded-lg mt-2 text-sm overflow-x-auto">
                {result.transfer_function}
              </div>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-700">Numerator N(s):</strong>
              <div className="font-mono bg-gray-100 p-4 rounded-lg mt-2 text-sm overflow-x-auto">
                {result.numerator}
              </div>
            </div>
            <div>
              <strong className="text-sm font-medium text-gray-700">Denominator D(s):</strong>
              <div className="font-mono bg-gray-100 p-4 rounded-lg mt-2 text-sm overflow-x-auto">
                {result.denominator}
              </div>
            </div>
            {result.poles?.length > 0 && (
              <div>
                <strong className="text-sm font-medium text-gray-700">Poles:</strong>
                <div className="font-mono bg-gray-100 p-4 rounded-lg mt-2 text-sm overflow-x-auto">
                  {result.poles.join(', ')}
                </div>
              </div>
            )}
            {result.zeros?.length > 0 && (
              <div>
                <strong className="text-sm font-medium text-gray-700">Zeros:</strong>
                <div className="font-mono bg-gray-100 p-4 rounded-lg mt-2 text-sm overflow-x-auto">
                  {result.zeros.join(', ')}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
      
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold mb-3 text-blue-900">Example Circuits:</h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-blue-800">RC Low-Pass Filter:</p>
            <code className="block bg-white p-2 rounded mt-1 text-xs">
              V1 1 0 ac<br/>
              R1 1 2 1k<br/>
              C1 2 0 1u
            </code>
          </div>
          <div>
            <p className="font-semibold text-blue-800">RL High-Pass Filter:</p>
            <code className="block bg-white p-2 rounded mt-1 text-xs">
              V1 1 0 ac<br/>
              L1 1 2 10m<br/>
              R1 2 0 100
            </code>
          </div>
        </div>
      </Card>
    </div>
  );
}