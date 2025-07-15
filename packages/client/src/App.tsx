import Navbar from "./components/Navbar"

function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <h1 className="text-3xl font-bold">PhotoX</h1>
      </div>
    </>
  )
}

export default App