import React, { useEffect, useState, useRef } from 'react'
import AddIcon from '@mui/icons-material/Add';

import './question.css'

// Question component: it is used to create an interactive container that displays
// a question and scrolls down to reveal an answer
//
// It takes 2 parameters:
//   - question: text of the question
//   - answer: text of the answer
export const Question = ({ question, answer }) => {
    const [active, setActive] = useState(false);

    const contentRef = useRef(null);

    useEffect(() => {
        contentRef.current.style.maxHeight = active
        ? `${contentRef.current.scrollHeight}px`
        : "0px";
    }, [contentRef, active]);

    const toggleAccordion = () => {
        setActive(!active);
    };

    return (
        <>
            <button
                className={`question-section ${active}`}
                onClick={toggleAccordion}
            >
                <div>
                    <div className="question-align">
                        <h4 className="question-style">
                            { question }
                        </h4>
                        <AddIcon className='question-icon'/>
                    </div>
                    <div
                        ref={contentRef}
                        className={active ? `answer answer-divider` : `answer`}
                    >
                        <p>{ answer }</p>
                    </div>
                </div>
            </button>
        </>
    );
}
