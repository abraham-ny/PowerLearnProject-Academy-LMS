/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-children-prop */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Avatar, Breadcrumbs, IconButton } from '@mui/material';
import { NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  materialDark,
  materialOceanic,
  dracula,
  vscDarkPlus,
  // a11yDark,
} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import SendIcon from '@mui/icons-material/Send';
import TypeWriterEffect from 'react-typewriter-effect';
import { useSelector } from 'react-redux';
import CommonTopTab from '../Components/CommonTopTab';
import MainContent from '../Components/MainContent';
import Typewriter from '../Components/Typewriter';
import useTypewriter from '../hooks/useTypewriter';
import geminiImage from '../Assets/icons/gemini.png';
import geminiLogo from '../Assets/icons/Google-Bard-Logo.png';
import ButtonSpinner from '../Components/ButtonSpinner';
import AIChatSkeleton from '../Components/AIChatSkeleton';

function AIChat() {
  const [response, setResponse] = useState('');
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const userDetails = useSelector((state) => state.auth.userDetails);

  const handlePromptChange = (event) => {
    setShowPrompt(false);
    setPrompt(event.target.value);
  };

  const handleGenerateText = async () => {
    setLoading(true);
    setShowPrompt(true);

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    try {
      const result = await model.generateContentStream(prompt);
      setLoading(false);
      let text = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        text += chunkText;
        setResponse(text);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const suggestions = [
    'Brainstorm presentation ideas about a topic',
    'Find flights and weather for an upcoming trip',
    'Ideas to surprise a friend on their birthday',
    'Help me incorporate more plant-based options in my diet',
  ];

  return (
    <div className="font-roboto_light h-screen fixed px-4 top-28 pr-6 left-[20%] extraLarge:left-[0%] extraLarge:w-full w-4/5">
      <div className="bg-green-5000 mt-4 rounded-lg h-3/4 relative">
        <div className="bg-white p-2 h-full overflow-y-scroll">
          {prompt && showPrompt && (
            <div className="flex gap-4 items-start mb-4 px-2">
              <Avatar src="" sx={{ width: 50, height: 50 }}>
                <div className="text-sm">
                  {userDetails?.firstname[0].toUpperCase()}
                  {userDetails?.lastname[0].toUpperCase()}
                </div>
              </Avatar>
              <div>
                <p className="font-sans font-medium capitalize">You</p>
                <p>{prompt}</p>
              </div>
            </div>
          )}
          {loading ? (
            <div>
              <AIChatSkeleton />
            </div>
          ) : (
            <>
              {!response && (
                <div className="h-full bg-green-2000 flex flex-col items-center justify-center">
                  <img
                    className="object-contain"
                    src={geminiImage}
                    height={100}
                    width={200}
                    alt="gemini-logo"
                  />
                  <p className="font-sans text-xl font-medium">
                    Hello, how can I assist you today?
                  </p>
                </div>
              )}
              <div className="flex gap-4 items-start mb-4 px-2">
                <Avatar src={geminiLogo} sx={{ width: 50, height: 50 }} />
                <div>
                  <p className="font-sans font-medium capitalize">Gemini AI</p>
                  <Markdown
                    children={response}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match =
                          /language-(\w+)/.exec(className || '') || 'scss';
                        return !inline && match ? (
                          <SyntaxHighlighter
                            wrapLongLines
                            children={String(children).replace(/\n$/, '')}
                            language={match[1] || 'javascript'}
                            style={vscDarkPlus}
                            {...props}
                          />
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleGenerateText();
          }}
          className="bg-yellow-5000 bg-white py-2"
        >
          <div className="w-3/4 mx-auto flex py-2 bg-gray-100 rounded-full">
            <input
              type="text"
              placeholder="Enter a prompt here"
              name="prompt"
              value={prompt}
              onChange={handlePromptChange}
              className="flex-1 rounded-md p-2 bg-gray-100 mx-auto focus:outline-none"
            />
            {loading ? (
              <div className="px-2 grid place-items-center">
                <ButtonSpinner />
              </div>
            ) : (
              <IconButton
                color="green"
                className={`${
                  prompt.trim() === '' ? ' cursor-not-allowed' : ''
                }`}
                disabled={prompt.trim() === ''}
                onClick={handleGenerateText}
              >
                <SendIcon
                  fontSize="small"
                  className={`${prompt.trim() === '' ? '' : 'text-claret-500'}`}
                />
              </IconButton>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AIChat;
