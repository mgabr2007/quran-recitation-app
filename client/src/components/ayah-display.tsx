import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BookOpen, Languages, Volume2 } from "lucide-react";
import { getAyahTranslation, getAyahArabicText } from "@/lib/translation-api";
import { BookmarkButton } from "@/components/bookmark-button";
import type { Ayah, BookmarkedAyah } from "@shared/schema";

interface AyahDisplayProps {
  currentAyah: Ayah | null;
  surahName: string;
  currentAyahNumber: number;
  totalAyahs: number;
  isPlaying: boolean;
  showTranslation?: boolean;
  onTranslationToggle?: (show: boolean) => void;
}

export const AyahDisplay = ({
  currentAyah,
  surahName,
  currentAyahNumber,
  totalAyahs,
  isPlaying,
  showTranslation = true,
  onTranslationToggle,
}: AyahDisplayProps) => {
  const [arabicText, setArabicText] = useState<string>('');
  const [translationText, setTranslationText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadAyahContent = async () => {
      if (!currentAyah) return;
      
      setIsLoading(true);
      try {
        const [arabic, translation] = await Promise.all([
          getAyahArabicText(currentAyah.surahId, currentAyah.number),
          getAyahTranslation(currentAyah.surahId, currentAyah.number)
        ]);
        
        setArabicText(arabic || currentAyah.text);
        setTranslationText(translation || currentAyah.translation);
      } catch (error) {
        console.warn('Failed to load ayah content, using fallback');
        setArabicText(currentAyah.text);
        setTranslationText(currentAyah.translation);
      } finally {
        setIsLoading(false);
      }
    };

    loadAyahContent();
  }, [currentAyah]);

  if (!currentAyah) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Select a surah and press play to begin recitation</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Header with surah info and controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Badge variant={isPlaying ? "default" : "secondary"} className="flex items-center gap-1">
              {isPlaying && <Volume2 className="h-3 w-3" />}
              {surahName}
            </Badge>
            <span className="text-sm text-gray-600">
              Ayah {currentAyahNumber} of {totalAyahs}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {currentAyah && <BookmarkButton ayah={currentAyah} />}
            
            {onTranslationToggle && (
              <div className="flex items-center gap-2">
                <Label htmlFor="translation-toggle" className="text-sm">
                  <Languages className="h-4 w-4 inline mr-1" />
                  Translation
                </Label>
                <Switch 
                  id="translation-toggle"
                  checked={showTranslation}
                  onCheckedChange={onTranslationToggle}
                />
              </div>
            )}
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-islamic-green mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading ayah content...</p>
          </div>
        )}

        {/* Arabic text */}
        {!isLoading && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-4">
                <p 
                  className="text-2xl md:text-3xl leading-loose font-arabic text-gray-900 dark:text-white"
                  style={{ fontFamily: "'Amiri Quran', 'Arabic Typesetting', serif", lineHeight: 2 }}
                  dir="rtl"
                >
                  {arabicText}
                </p>
              </div>
              
              {/* Translation */}
              {showTranslation && translationText && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Languages className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                    <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                      {translationText}
                    </p>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 text-right">
                    — Saheeh International Translation
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};