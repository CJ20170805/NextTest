
export async function GET(request: Request) {
    const name = 'gy'
    const email = 'gy@gmais.com'
    return Response.json({ name, email })
  }
