export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { netlist, input_node, output_node } = body;
      
      // Get backend URL from environment variable or use localhost for development
      const backendUrl = process.env.CIRCUIT_ANALYZER_URL || 'http://localhost:5001';
      
      // Call Python backend
      const response = await fetch(`${backendUrl}/api/transfer-function`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          netlist,
          input_node: input_node || '1',
          output_node: output_node || '2'
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        return Response.json({ error: data.error }, { status: 400 });
      }
      
      return Response.json(data);
      
    } catch (error) {
      return Response.json(
        { error: 'Failed to calculate transfer function' }, 
        { status: 500 }
      );
    }
  }