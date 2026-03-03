export default function ErrorPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>Authentication Error</h1>
      <p>Something went wrong. Please check your credentials and try again.</p>
      <a href="/login">Back to Login</a>
    </div>
  )
}
