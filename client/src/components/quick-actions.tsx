import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  RotateCcw, 
  Bookmark, 
  Share, 
  History,
  BookmarkCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickActionsProps {
  currentSurahId: number;
  currentAyahNumber: number;
  isBookmarked: boolean;
  onReset: () => void;
  onBookmark: () => void;
}

export const QuickActions = ({
  currentSurahId,
  currentAyahNumber,
  isBookmarked,
  onReset,
  onBookmark,
}: QuickActionsProps) => {
  const { toast } = useToast();

  const handleShare = () => {
    const shareText = `I'm practicing Quran recitation - Surah ${currentSurahId}, Ayah ${currentAyahNumber}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Quran Recitation Progress',
        text: shareText,
        url: window.location.href,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to clipboard",
          description: "Progress shared to clipboard",
        });
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard", 
        description: "Progress shared to clipboard",
      });
    }
  };

  const handleViewHistory = () => {
    toast({
      title: "Coming Soon",
      description: "Session history feature will be available soon",
    });
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            onClick={onReset}
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-center flex-col h-auto"
          >
            <RotateCcw className="h-5 w-5 text-gray-600 mb-2" />
            <span className="text-sm text-gray-700">Reset</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={onBookmark}
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-center flex-col h-auto"
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-5 w-5 text-islamic-green mb-2" />
            ) : (
              <Bookmark className="h-5 w-5 text-gray-600 mb-2" />
            )}
            <span className="text-sm text-gray-700">
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </span>
          </Button>
          
          <Button
            variant="outline"
            onClick={handleShare}
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-center flex-col h-auto"
          >
            <Share className="h-5 w-5 text-gray-600 mb-2" />
            <span className="text-sm text-gray-700">Share</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={handleViewHistory}
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-center flex-col h-auto"
          >
            <History className="h-5 w-5 text-gray-600 mb-2" />
            <span className="text-sm text-gray-700">History</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
