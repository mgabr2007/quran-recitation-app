import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  RotateCw,
  Repeat,
  PauseCircle,
  Loader2
} from "lucide-react";
import type { Ayah } from "@shared/schema";
import { formatTime } from "@/lib/quran-data";

interface AudioPlayerProps {
  currentAyah: Ayah | null;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  pauseDuration: number;
  surahName: string;
  currentAyahNumber: number;
  totalAyahs: number;
  error: string | null;
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onRewind: () => void;
  onForward: () => void;
  onRepeat: () => void;
  onSeek: (time: number) => void;
}

export const AudioPlayer = ({
  currentAyah,
  isPlaying,
  isPaused,
  isLoading,
  currentTime,
  duration,
  progress,
  pauseDuration,
  surahName,
  currentAyahNumber,
  totalAyahs,
  error,
  onPlay,
  onPause,
  onPrevious,
  onNext,
  onRewind,
  onForward,
  onRepeat,
  onSeek,
}: AudioPlayerProps) => {
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    onSeek(newTime);
  };

  if (error) {
    return (
      <Card className="bg-white rounded-xl shadow-sm border border-red-200">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={onPlay}
              className="bg-islamic-green hover:bg-islamic-dark"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Current Ayah Display */}
          <div className="text-center">
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <div className="text-right mb-4">
                <p 
                  className="font-arabic text-3xl text-islamic-dark leading-loose"
                  dir="rtl"
                >
                  {currentAyah?.text || "Please select a surah to begin"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 italic">
                  {currentAyah?.translation || "Translation will appear here"}
                </p>
              </div>
            </div>
            <div className="flex justify-center space-x-4 text-sm text-gray-500">
              <span>{surahName}</span>
              <span>•</span>
              <span>Ayah {currentAyahNumber} of {totalAyahs}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div 
              className="cursor-pointer"
              onClick={handleProgressClick}
            >
              <Progress 
                value={progress} 
                className="w-full h-2 progress-bar"
              />
            </div>
          </div>

          {/* Audio Controls */}
          <div className="flex justify-center items-center space-x-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              className="p-3 text-gray-400 hover:text-islamic-green transition-colors"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onRewind}
              className="p-2 text-gray-400 hover:text-islamic-green transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="text-xs ml-1">10s</span>
            </Button>

            <Button
              onClick={isPlaying ? onPause : onPlay}
              disabled={isLoading}
              className="w-16 h-16 bg-islamic-green hover:bg-islamic-dark rounded-full shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              ) : isPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 text-white ml-1" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onForward}
              className="p-2 text-gray-400 hover:text-islamic-green transition-colors"
            >
              <RotateCw className="h-4 w-4" />
              <span className="text-xs ml-1">10s</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              className="p-3 text-gray-400 hover:text-islamic-green transition-colors"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Additional Controls */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={onRepeat}
              className="px-4 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Repeat className="h-4 w-4" />
              <span>Repeat</span>
            </Button>
            
            <Button
              variant="outline"
              className="px-4 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
            >
              <PauseCircle className="h-4 w-4" />
              <span>Pause: {pauseDuration}s</span>
            </Button>
          </div>

          {/* Pause Status */}
          {isPaused && (
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-islamic-green/10 text-islamic-green rounded-lg">
                <PauseCircle className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">
                  Pausing between ayahs ({pauseDuration}s)
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
