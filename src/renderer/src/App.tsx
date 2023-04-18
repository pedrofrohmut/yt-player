import "./assets/app.css"

import { useRef, useState } from "react"

const App = () => {
    const [isSubmitted, setIsSubmitted] = useState(false)

    const urlRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitted(true)

        if (!urlRef || !urlRef.current) return
        const url = urlRef.current.value
        const response = await window.mycustom.downloadYT(url)

        setIsSubmitted(false)
        alert(response)
    }

    return (
        <div className="page-container">
            <div className="page-title">YTPlayer</div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="url-input"
                    placeholder="YT URL here"
                    ref={urlRef}
                />
                <input type="text" className="" placeholder="Artist" />
                <input type="text" className="" placeholder="Music" />
                <input type="text" className="" placeholder="Album" />
                <button type="submit" disabled={isSubmitted}>
                    Download
                </button>
            </form>
        </div>
    )
}
export default App
