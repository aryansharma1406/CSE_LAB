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
  
  export function convertCircuitToNetlist(components: Component[]): string {
    if (!components || components.length === 0) {
      return ''
    }
  
    let netlist = ''
    let nodeCounter = 1
  
    // Map component types to SPICE notation
    components.forEach((component, index) => {
      switch (component.type) {
        case 'battery':
          // Voltage source: V<name> <node+> <node-> ac
          const voltage = component.value?.replace('V', '') || '9'
          netlist += `V${index + 1} ${nodeCounter} 0 ac\n`
          nodeCounter++
          break
          
        case 'resistor':
          // Resistor: R<name> <node1> <node2> <value>
          let resistance = component.value?.replace('Ω', '').replace('k', '000') || '1k'
          // Ensure it's in the right format (1k not 1000)
          if (!resistance.includes('k') && !resistance.includes('m')) {
            resistance = resistance.replace('000', 'k')
          }
          netlist += `R${index + 1} ${nodeCounter} ${nodeCounter + 1} ${resistance}\n`
          nodeCounter += 2
          break
          
        case 'capacitor':
          // Capacitor: C<name> <node1> <node2> <value>
          let capacitance = component.value?.replace('μF', 'u').replace('F', '') || '1u'
          // Convert μF to u for SPICE format
          capacitance = capacitance.replace('100μ', '100u')
          netlist += `C${index + 1} ${nodeCounter} 0 ${capacitance}\n`
          nodeCounter++
          break
          
        case 'led':
          // LED approximated as a diode with series resistance
          netlist += `D${index + 1} ${nodeCounter} ${nodeCounter + 1} LED\n`
          netlist += `R${index + 1}_series ${nodeCounter + 1} ${nodeCounter + 2} 100\n`
          nodeCounter += 3
          break
          
        case 'diode':
          // Diode: D<name> <node+> <node-> <model>
          netlist += `D${index + 1} ${nodeCounter} ${nodeCounter + 1} 1N4148\n`
          nodeCounter += 2
          break
          
        case 'switch':
          // Switch as a variable resistor (open = high resistance, closed = low)
          const switchValue = component.value === 'Open' ? '1000000' : '0.01'
          netlist += `R${index + 1}_switch ${nodeCounter} ${nodeCounter + 1} ${switchValue}\n`
          nodeCounter += 2
          break
      }
    })
  
    return netlist.trim()
  }
  
  export function getInputOutputNodes(components: Component[]): { input: string, output: string } {
    // First node after ground (0) is typically input
    // Last node is typically output
    const nodeCount = components.length * 2
    
    return {
      input: '1',
      output: nodeCount > 0 ? String(Math.min(nodeCount, 3)) : '2'
    }
  }