export default function TestStyles() {
  return (
    <div className="p-8 space-y-6">
      <h1>Typography Test</h1>
      <h2>This is a heading 2</h2>
      <p>This is a paragraph with some text.</p>
      
      <div className="space-y-4">
        <button className="btn-primary">Primary Button</button>
        <button className="btn-secondary">Secondary Button</button>
      </div>
      
      <div className="card">
        <h3>Card Component</h3>
        <p>This is inside a card.</p>
      </div>
      
      <div className="space-x-2">
        <span className="badge badge-success">Success</span>
        <span className="badge badge-error">Error</span>
      </div>
    </div>
  )
} 