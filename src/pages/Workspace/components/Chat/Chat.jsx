import { Paperclip, Send } from "lucide-react"
import DummyImg from "./DummyImg"

function MessageLeft({ text, time }) {
  return (
    <div className="flex items-start gap-2">

      <DummyImg />

      <div className="max-w-[70%] bg-(--received-message) px-4 py-2 rounded-2xl rounded-bl-none text-sm">
        {text}
        <div className="text-xs opacity-60 text-right mt-1">{time}</div>
      </div>

    </div>
  )
}

function MessageRight({ text, time }) {
  return (
    <div className="flex items-start gap-2 justify-end">
      <div className="max-w-[70%] bg-(--sent-message) px-4 py-2 rounded-2xl rounded-br-none text-sm">
        {text}
        <div className="text-xs opacity-60 text-right mt-1">{time}</div>
      </div>
    </div>
  )
}

function SendFileBtn() {
    return (
        <button className="svg-btn icon-btn">
            <Paperclip color="var(--secondary-text-color)" />
        </button>
    )
}

function SendMessageBtn() {
    return (
        <button className="svg-btn icon-btn">
            <Send color="var(--secondary-text-color)" />
        </button>
    )
}

function TypeMessage() {
    return (
        <div className="type-message grid grid-cols-[min-content_1fr_min-content] gap-4 border border-(--main-border-color) rounded-2xl px-4 py-1">
            <SendFileBtn />
            <input type="text" className="bg-(--card-bg-lighter2) px-4 py-2 focus:outline-none" placeholder="Type a message..." />
            <SendMessageBtn /> 
        </div>
    )
}

export default function Chat() {
    return (
        <div className="chat-container bg-(--card-bg-lighter) flex flex-col gap-4 border border-(--main-border-color) rounded-2xl p-2.5 pt-4">

            <div className="chat flex flex-col gap-4 overflow-y-scroll no-scrollbar h-150">
                <MessageLeft text="Hello! How can I help you today?" time="10:15 AM" />
                <MessageRight text="Hi how are you" time="20:30" />
                <MessageLeft text="Fine how’s the task going" time="20:30" />
                <MessageRight text="it's going well" time="20:30" />
                <MessageLeft text="Have you heard about the new spec?" time="20:30" />
                <MessageLeft text="The product manager is saying mr Gustoii wants a bunch of new set of features to be implemented as fast as possible." time="20:30" />
                <MessageRight text="Ok we'll try our best" time="20:30" />
            </div>

            <TypeMessage />
        </div>
    )
}