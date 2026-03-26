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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

  const formatTimestamp = (time: number) => {
    let durationToCalc = time;
    let hour = 0;
    let minute = 0;
    let second = 0;
    let formattedTime = '';

    if (duration > 3600) {
      hour = Math.floor(duration / 3600);
      durationToCalc = duration % 3600;
      formattedTime = `${hour.toString().padStart(2, '0')}:`;
    }

    if (durationToCalc > 60) {
      minute = Math.floor(durationToCalc / 60);
      durationToCalc = durationToCalc % 60;
      formattedTime += `${minute.toString().padStart(2, '0')}:`;
    } else {
      formattedTime += '00:';
    }

    second = Math.floor(durationToCalc);
    formattedTime += `${second.toString().padStart(2, '0')}`;

    return formattedTime;
  };

  const updateTimestamp = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const updateDuration = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  return (
    <>
      <div className="noteplayer-container">
        <video
          ref={videoRef}
          src={src}
          className="noteplayer"
          onClick={togglePlay}
          onTimeUpdate={updateTimestamp}
          onLoadedMetadata={updateDuration}
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
            <div className="noteplayer__timestamp">
              {formatTimestamp(currentTime)} / {formatTimestamp(duration)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Player;
