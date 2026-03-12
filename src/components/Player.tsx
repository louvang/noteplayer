import './Player.css';

interface PlayerProps {
  src: string;
}

function Player({ src }: PlayerProps) {
  return (
    <>
      <video src={src} controls className="noteplayer" />
    </>
  );
}

export default Player;
