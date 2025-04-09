import { ImageContainer } from '@/shared/ui';

interface Props {
  type: 'BOT' | 'USER';
  text: string;
}

const ChatItem = ({ type, text }: Props) => {
  return (
    <li className={`flex gap-3 ${type == 'BOT' ? 'justify-start' : 'justify-end'} items-center`}>
      {type == 'BOT' ? <ImageContainer imgSrc={'/image/ChatBot.png'} size="small" /> : null}
      <p
        className={`text-text-lg rounded-xl px-4 py-2 ${type == 'BOT' ? 'bg-gray-100 text-gray-700' : 'bg-brand-primary-500 text-white'}`}
      >
        {text}
      </p>
    </li>
  );
};

export default ChatItem;
