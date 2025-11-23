'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Minus } from 'lucide-react';

export default function ManualTransferFunction() {
  const [gain, setGain] = useState('1');
  const [poles, setPoles] = useState<string[]>(['']);
  const [zeros, setZeros] = useState<string[]>(['']);
  const [result, setResult] = useState<string>('');

  const addPole = () => setPoles([...poles, '']);
  const removePole = (index: number) => setPoles(poles.filter((_, i) => i !== index));
  const updatePole = (index: number, value: string) => {
    const newPoles = [...poles];
    newPoles[index] = value;
    setPoles(newPoles);
  };

  const addZero = () => setZeros([...zeros, '']);
  const removeZero = (index: number) => setZeros(zeros.filter((_, i) => i !== index));
  const updateZero = (index: number, value: string) => {
    const newZeros = [...zeros];
    newZeros[index] = value;
    setZeros(newZeros);
  };

  const calculateTransferFunction = () => {
    try {
      const K = parseFloat(gain) || 1;
      
      // Build numerator from zeros
      const validZeros = zeros.filter(z => z.trim() !== '').map(z => parseFloat(z));
      let numerator = `${K}`;
      if (validZeros.length > 0) {
        const zeroTerms = validZeros.map(z => {
          if (z === 0) return 's';
          return z > 0 ? `(s + ${z})` : `(s - ${Math.abs(z)})`;
        });
        numerator = `${K} × ${zeroTerms.join(' × ')}`;
      }

      // Build denominator from poles
      const validPoles = poles.filter(p => p.trim() !== '').map(p => parseFloat(p));
      let denominator = '1';
      if (validPoles.length > 0) {
        const poleTerms = validPoles.map(p => {
          if (p === 0) return 's';
          return p > 0 ? `(s + ${p})` : `(s - ${Math.abs(p)})`;
        });
        denominator = poleTerms.join(' × ');
      }

      const order = Math.max(validPoles.length, validZeros.length);
      const transferFunction = `H(s) = ${numerator} / ${denominator}`;
      
      setResult(`Transfer Function (Order ${order}):\n${transferFunction}`);
    } catch (error) {
      setResult('Error: Please enter valid numbers');
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manual Transfer Function Builder</h2>
      <p className="text-sm text-gray-600 mb-4">
        Build a transfer function by specifying gain, poles, and zeros
      </p>

      <div className="space-y-6">
        {/* Gain */}
        <div>
          <Label htmlFor="gain">Gain (K)</Label>
          <Input
            id="gain"
            type="number"
            step="any"
            value={gain}
            onChange={(e) => setGain(e.target.value)}
            placeholder="1"
            className="mt-2"
          />
        </div>

        {/* Poles */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Poles (values of -p where H(s) → ∞)</Label>
            <Button size="sm" variant="outline" onClick={addPole}>
              <Plus className="h-4 w-4 mr-1" />
              Add Pole
            </Button>
          </div>
          <div className="space-y-2">
            {poles.map((pole, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="number"
                  step="any"
                  value={pole}
                  onChange={(e) => updatePole(index, e.target.value)}
                  placeholder={`Pole ${index + 1} (e.g., -2)`}
                />
                {poles.length > 1 && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removePole(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter pole values (e.g., -2 creates factor (s + 2))
          </p>
        </div>

        {/* Zeros */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Zeros (values of -z where H(s) = 0)</Label>
            <Button size="sm" variant="outline" onClick={addZero}>
              <Plus className="h-4 w-4 mr-1" />
              Add Zero
            </Button>
          </div>
          <div className="space-y-2">
            {zeros.map((zero, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="number"
                  step="any"
                  value={zero}
                  onChange={(e) => updateZero(index, e.target.value)}
                  placeholder={`Zero ${index + 1} (e.g., -1)`}
                />
                {zeros.length > 1 && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeZero(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter zero values (e.g., -1 creates factor (s + 1))
          </p>
        </div>

        {/* Calculate Button */}
        <Button onClick={calculateTransferFunction} className="w-full">
          Generate Transfer Function
        </Button>

        {/* Result */}
        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <pre className="text-sm font-mono whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>

      {/* Examples */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-sm text-blue-900 mb-2">Examples:</h3>
        <div className="space-y-2 text-xs text-blue-800">
          <div>
            <strong>First Order Low-Pass:</strong> Gain=1, Pole=-1000
            <br />
            <code>H(s) = 1 / (s + 1000)</code>
          </div>
          <div>
            <strong>Second Order:</strong> Gain=100, Poles=-10,-20
            <br />
            <code>H(s) = 100 / ((s + 10)(s + 20))</code>
          </div>
        </div>
      </div>
    </Card>
  );
}