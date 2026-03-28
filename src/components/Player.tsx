import './Player.css';
import playIcon from '../assets/icons/play.svg';
import pauseIcon from '../assets/icons/pause.svg';
import { useState, useRef } from 'react';

interface PlayerProps {
  src: string;
}

function Player({ src }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timestampRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playBtnHidden, setPlayBtnHidden] = useState(false);
  const [duration, setDuration] = useState(0);
  const [elapsedLocation, setElapsedLocation] = useState(0);
  const [hoverLocation, setHoverLocation] = useState(0);
  const [hoverTime, setHoverTime] = useState(0);
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [timestampPosition, setTimestampPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

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

    // convert to percentage for css state change
    let elapsedPercent = (videoRef.current.currentTime / duration) * 100;
    setElapsedLocation(elapsedPercent);
  };

  const updateDuration = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleTimelineClick = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = hoverTime;
    console.log('hi i rendered');
  };

  const updateHoverLocation = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    if (!timestampRef.current) return;

    let rect = e.currentTarget.getBoundingClientRect();
    let hoveredLoc = e.clientX - rect.left;
    let hoverToTime = (hoveredLoc / rect.width) * 100;
    setHoverLocation(hoverToTime);

    // convert to the hovered time and update the timestamp
    let seekLoc = e.clientX - rect.left;
    let newTime = (seekLoc / rect.width) * duration;
    let timeStampLoc = seekLoc - timestampRef.current.offsetWidth / 2;

    setHoverTime(newTime);

    if (isSeeking) {
      videoRef.current.currentTime = newTime;
    }

    setShowTimestamp(true);
    setTimestampPosition(timeStampLoc);
  };

  const resetHoverLocation = () => {
    setHoverLocation(0);
    setShowTimestamp(false);
  };

  const startSeek = () => {
    setIsSeeking(true);
  };

  const endSeek = () => {
    setIsSeeking(false);
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
            onMouseDown={startSeek}
            onMouseUp={endSeek}
            onMouseLeave={resetHoverLocation}
            onClick={handleTimelineClick}
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
              ref={timestampRef}
              className={`noteplayer__timestamp ${!showTimestamp ? 'noteplayer__timestamp--hide' : ''}`}
              style={{ left: timestampPosition + 'px' }}
            >
              {formatTimestamp(hoverTime)} / {formatTimestamp(duration)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Player;
