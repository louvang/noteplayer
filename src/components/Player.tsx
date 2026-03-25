import './Player.css';
import playIcon from '../assets/icons/play.svg';
import pauseIcon from '../assets/icons/pause.svg';
import { useState, useRef } from 'react';

interface PlayerProps {
  src: string;
}

function Player({ src }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playBtnHidden, setPlayBtnHidden] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    setIsPlaying(!isPlaying);

    if (isPlaying) {
      video.pause();
      setPlayBtnHidden(false);
    } else {
      video.play();
      setPlayBtnHidden(true);
    }
  };

  return (
    <>
      <div className="noteplayer-container">
        <video
          ref={videoRef}
          src={src}
          className="noteplayer"
          onClick={togglePlay}
          playsInline
        />
        <div
          className={`noteplayer__play-button ${playBtnHidden ? 'noteplayer__play-button--hidden' : ''}`}
          onClick={togglePlay}
        >
          <img src={isPlaying ? pauseIcon : playIcon} alt="play" />
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
