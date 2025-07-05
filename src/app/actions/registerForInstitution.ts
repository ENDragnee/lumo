
'use server'; // This marks the function as a Server Action
export async function registerForInstitution(institutionId: string, metadata: Record<string, any>) {
  
  // Here we call the API endpoint we created earlier.
  // In a real app, you'd get the base URL from an environment variable.
  const response = await fetch(`/api/institutions/${institutionId}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ metadata }),
    // Important: Re-use the user's cookie for authentication
    cache: 'no-store', 
  });
  
  return response.json();
}

