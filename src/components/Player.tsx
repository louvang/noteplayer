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
  const [elapsedLocation, setElapsedLocation] = useState(0);
  const [hoverLocation, setHoverLocation] = useState(0);
  const [showTimestamp, setShowTimestamp] = useState('none');

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

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);

    // convert to percentage for css state change
    let elapsedPercent = (videoRef.current.currentTime / duration) * 100;
    setElapsedLocation(elapsedPercent);
  };

  const updateDuration = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const goToSeekLocation = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    let rect = e.currentTarget.getBoundingClientRect();

    // convert to the new time user wants to jump to
    let seekLoc = e.clientX - rect.left;
    let newTime = (seekLoc / rect.width) * duration;

    // now jump
    videoRef.current.currentTime = newTime;
  };

  const updateHoverLocation = (e: React.MouseEvent<HTMLDivElement>) => {
    let rect = e.currentTarget.getBoundingClientRect();
    let hoveredLoc = e.clientX - rect.left;
    let hoverToTime = (hoveredLoc / rect.width) * 100;
    setHoverLocation(hoverToTime);
  };

  const resetHoverLocation = () => {
    setHoverLocation(0);
  };

  return (
    <>
      <div className="noteplayer-container">
        <video
          ref={videoRef}
          src={src}
          className="noteplayer"
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
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
          <div
            className="noteplayer__progress-area"
            onMouseMove={updateHoverLocation}
            onMouseLeave={resetHoverLocation}
            onClick={goToSeekLocation}
          >
            <div className="noteplayer__progress-bg"> </div>
            <div className="noteplayer__progress-base noteplayer__progress-bg">
              {' '}
            </div>
            <div
              className="noteplayer__progress-base noteplayer__progress-hovered"
              style={{ width: hoverLocation + '%' }}
            >
              {' '}
            </div>
            <div
              className="noteplayer__progress-base noteplayer__progress-elapsed"
              style={{ width: elapsedLocation + '%' }}
            >
              {' '}
            </div>
            <div
              className="noteplayer__timestamp"
              style={{ display: showTimestamp }}
            >
              {formatTimestamp(currentTime)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Player;
