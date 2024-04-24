import React from 'react';
import { motion } from 'framer-motion';
import '../../index.css';

function Home() {
    const sentence = "EVERYWORD,.EVERWHERE,.ALL IN HERE!";
    const words = sentence.split(".");

    const wordVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1 + 0.5,
                duration: 0.9,
                ease: "easeOut"
            }
        })
    };

    const paragraphVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { delay: 1.1, duration: 0.7 }
        }
    };

    return (
        <div className="container">
            <div className="home">
                <h1>
                    {words.map((word, index) => (
                        <motion.div
                            key={index}
                            variants={wordVariants}
                            initial="hidden"
                            animate="visible"
                            custom={index}
                            style={{ marginBottom: '0.5rem' }}
                        >
                            {word}
                        </motion.div>
                    ))}
                </h1>
                <motion.p
                    variants={paragraphVariants}
                    initial="hidden"
                    animate="visible"
                >
                    Welcome to your Password Manager.
                </motion.p>
            </div>
        </div>
    );
}

export default Home;
