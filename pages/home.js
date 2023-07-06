import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';


const Home = () => {
  const [message, setMessage] = useState('');
  const [submit, setSubmit]   = useState(false)
  const [data, setData]       = useState('')
  const [response, setResponse] = useState('');
  const [recieved, setRecieved] = useState(false)
  const textareaRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const splitLines = response.split('\n');
    const timer = setTimeout(() => {
      if (currentIndex < splitLines.length) {
        setLines(prevLines => [...prevLines, splitLines[currentIndex]]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }
    }, 500);

    return () => clearTimeout(timer);
    
  }, [response, currentIndex]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true)
    setRecieved(false)
    setResponse('')
    setLines([])
    setMessage('')
    setCurrentIndex(0)

    try {
        axios.post('http://127.0.0.1:5001/get_lyrics' , {'data' : message})
        .then( response => {
              setRecieved(true)
              setResponse(response.data)
              setMessage('');
           }

        )

      } catch (error) {
        console.error('Error:', error);
      }
  };

  const handleKeyDown = (e) => {
    // Pressing Shift + Enter creates a new line
    if (e.key === 'Enter' && e.shiftKey) {
      setMessage((prevMessage) => prevMessage + '\n');
    }
  };

  const handleTextareaResize = () => {
    if (!textareaRef.current) {
      return;
    }

    const maxRows = 5;
    const lineHeight = parseInt(window.getComputedStyle(textareaRef.current).lineHeight);
    const maxHeight = maxRows * lineHeight;
    const scrollHeight = textareaRef.current.scrollHeight;

    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.overflowY = scrollHeight > maxHeight ? 'scroll' : 'auto';
    textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  };


  useEffect(() => {
    handleTextareaResize();
  }, [message]);

  return (
    <div className="flex h-screen">
      <div className="w-1/6 bg-black-800"></div>
      <div className="w-2/3 bg-gray-800">
      <div className="h-screen overflow-y-auto flex flex-col ">
      {/* <div className='bg-white'> */}
        {submit && (
            <div className="bg-black bg-gray-600 px-20 py-4  rounded-lg text-center w-1000">
                <p>Generating the lyrics....</p>
                
            </div>
        )}
        {recieved && (
            <div className="bg-gray-800 px-20 py-10 rounded-lg text-center w-1000">
                <div>
                  {lines.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
                
            </div>

        )}
        
        <div className="absolute bottom-0">
            <form className="flex  px-20 py-2  rounded-b-lg " style={{ zIndex: '10' }}>
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onInput={handleTextareaResize}
                    className="p-2 border rounded-md resize-none focus:outline-none focus:ring focus:ring-blue-300"
                    style={{ width: '700px', height: '50px' }}
                    placeholder="Start the song..."
                />
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md ml-4"
                >
                    generate
                </button>
            </form>
        </div>
      </div>
      </div>
    <div className="w-1/6 bg-black-800"></div>
  </div>
    
    
  
         
  );
};

export default Home;
