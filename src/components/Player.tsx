import './Player.css';
import playIcon from '../assets/icons/play.svg';

interface PlayerProps {
  src: string;
}

function Player({ src }: PlayerProps) {
  return (
    <>
      <div className="noteplayer-container">
        <video src={src} className="noteplayer" playsInline />
        <div className="noteplayer__play-button">
          <img src={playIcon} alt="play" />
        </div>

        <div className="noteplayer__progress-container">
          <div className="noteplayer__progress-bar">
            <div className="noteplayer__progress"> </div>
            <div className="noteplayer__timestamp">0:00</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Player;
