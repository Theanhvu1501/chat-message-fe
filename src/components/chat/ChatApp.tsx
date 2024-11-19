import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import chatData from "../../../chat_data.json";
import notiVoice from "../../../noti_voice/iphone_notification.mp3";
import { ChatData } from "../../app/app";
import styles from "./ChatApp.module.css";

const BOT_TOKEN = import.meta.env.VITE_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_CHAT_ID;
const AVATAR_1 = import.meta.env.VITE_AVATAR_1;
const AVATAR_3 = import.meta.env.VITE_AVATAR_3;
interface ChatAppProps {
  name?: string;
  color?: string;
}

const ChatApp: React.FC<ChatAppProps> = ({ name, color }) => {
  const [messages, setMessages] = useState<ChatData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const previousMessageRef = useRef<ChatData | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Set isMounted to true when component mounts

    return () => {
      setIsMounted(false); // Set isMounted to false when component unmounts
    };
  }, []);

  const sendTelegramMessage = async (message: string) => {
    const botToken = BOT_TOKEN;
    const chatId = CHAT_ID;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const dateNow = new Date();
    const text = `✅ ${dateNow.toLocaleString()} : ${message}`;
    try {
      await axios.post(url, {
        chat_id: chatId,
        text,
      });
    } catch (error) {
      console.error("Error sending message to Telegram:", error);
    }
  };

  useEffect(() => {
    const displayMessages = async () => {
      if (isMounted && currentIndex < chatData.length) {
        // Check if component is mounted before executing
        const currentMessage = chatData[currentIndex];
        if (currentIndex === 0) {
          // Delay for 2 seconds before displaying the first message
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const audio = new Audio(notiVoice);
          // Phát âm thanh
          audio
            .play()
            .catch((error) => console.error("Error playing audio:", error));
          // Chờ âm thanh kết thúc hoặc hết 4 giây (lấy thời gian tối đa)
          await Promise.all([
            new Promise((resolve) => (audio.onended = resolve)),
            new Promise((resolve) => setTimeout(resolve, 2000)),
          ]);
        }
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, currentMessage];
          if (updatedMessages.length > 3) {
            updatedMessages.shift();
            updatedMessages.shift();
            updatedMessages.shift();
          }
          return updatedMessages;
        });
        if (currentMessage.audioFile) {
          const audio = new Audio(`../../../${currentMessage.audioFile}`);
          audio
            .play()
            .catch((error) => console.error("Error playing audio:", error));
          audio.onended = () => {
            if (currentIndex === chatData.length - 1) {
              sendTelegramMessage("Success");
            }
            setTimeout(() => {
              setCurrentIndex((prevIndex) => prevIndex + 1);
            }, 1000);
          };
        }
        previousMessageRef.current = currentMessage;
      }
    };

    displayMessages();
  }, [currentIndex, isMounted]);

  return (
    <div
      className="relative  mx-auto border border-gray-300 shadow-lg overflow-hidden"
      style={{
        height: 720,
        width: 1280,
      }}
    >
      <div
        className="relative z-10  mx-auto border border-gray-300 shadow-lg"
        style={{
          height: 720,
          width: 1280,
          backgroundColor: "#527c81",
        }}
      >
        <div className="relative">
          <img src={"/asset/header.png"} className={styles.animatedImage} />
          <span
            className={styles.animatedImage}
            style={{
              fontFamily: "Binggrae Regular",
              position: "absolute",
              top: 0,
              color: "white",
              fontSize: 48,
              left: 96,
            }}
          >
            {name}
          </span>
        </div>

        <div className="mt-10 mb-4 p-4">
          {messages.map((msg) => (
            <div
              key={msg.timestamp}
              className={`flex ${
                msg.speaker === "Speaker 2" || msg.speaker === "Speaker 4"
                  ? "justify-end"
                  : "justify-start"
              } mb-16`}
            >
              <div
                className={`flex ${
                  msg.speaker === "Speaker 2" || msg.speaker === "Speaker 4"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {msg.speaker !== "Speaker 2" && msg.speaker !== "Speaker 4" && (
                  <img
                    src={msg.speaker === "Speaker 1" ? AVATAR_1 : AVATAR_3}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full mr-2 object-cover"
                  />
                )}
                <MessageBox
                  type="text"
                  text={msg?.text}
                  position={
                    msg.speaker === "Speaker 2" || msg.speaker === "Speaker 4"
                      ? "right"
                      : "left"
                  }
                  styles={{
                    backgroundColor:
                      msg.speaker === "Speaker 2" || msg.speaker === "Speaker 4"
                        ? color || "#FAE100"
                        : "",
                    padding: 10,
                    borderRadius: 20,
                    borderTopLeftRadius:
                      msg.speaker === "Speaker 2" || msg.speaker === "Speaker 4"
                        ? 20
                        : 0,
                    borderTopRightRadius:
                      msg.speaker === "Speaker 2" || msg.speaker === "Speaker 4"
                        ? 0
                        : 20,
                    color:
                      (msg.speaker === "Speaker 2" ||
                        msg.speaker === "Speaker 4") &&
                      color === "#068AFE"
                        ? "white"
                        : "",
                  }}
                  notchStyle={{
                    fill:
                      msg.speaker === "Speaker 2" || msg.speaker === "Speaker 4"
                        ? color || "#FAE100"
                        : "",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
