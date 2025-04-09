/**
 * Creative Direction Hook
 * 
 * This hook manages the state for creative direction inputs in the comic creator:
 * - Genre, emotion, inspiration settings
 * - Form state management
 * - Reset functionality
 */
import { useState, useCallback } from 'react';

export interface CreativeDirection {
  genre?: string;
  emotion?: string;
  inspiration?: string;
  inspirationText?: string;
  exclusions?: string;
}

interface UseCreativeDirectionProps {
  initialValues?: CreativeDirection;
  onDirectionChange?: () => void;
}

interface UseCreativeDirectionReturn {
  genre: string;
  emotion: string;
  inspiration: string;
  inspirationText: string;
  exclusions: string;
  setGenre: (value: string) => void;
  setEmotion: (value: string) => void;
  setInspiration: (value: string) => void;
  setInspirationText: (value: string) => void;
  setExclusions: (value: string) => void;
  resetCreativeDirection: () => void;
  getCreativeDirectionObject: () => CreativeDirection;
  setCreativeDirectionFromObject: (direction: CreativeDirection) => void;
}

/**
 * Hook for managing creative direction state
 */
export const useCreativeDirection = ({
  initialValues = {},
  onDirectionChange
}: UseCreativeDirectionProps = {}): UseCreativeDirectionReturn => {
  // Initialize state with initial values or empty strings
  const [genre, setGenreState] = useState(initialValues.genre || '');
  const [emotion, setEmotionState] = useState(initialValues.emotion || '');
  const [inspiration, setInspirationState] = useState(initialValues.inspiration || '');
  const [inspirationText, setInspirationTextState] = useState(initialValues.inspirationText || '');
  const [exclusions, setExclusionsState] = useState(initialValues.exclusions || '');

  // Wrapper setters that call onDirectionChange when values change
  const setGenre = useCallback((value: string) => {
    setGenreState(value);
    if (onDirectionChange) onDirectionChange();
  }, [onDirectionChange]);

  const setEmotion = useCallback((value: string) => {
    setEmotionState(value);
    if (onDirectionChange) onDirectionChange();
  }, [onDirectionChange]);

  const setInspiration = useCallback((value: string) => {
    setInspirationState(value);
    if (onDirectionChange) onDirectionChange();
  }, [onDirectionChange]);

  const setInspirationText = useCallback((value: string) => {
    setInspirationTextState(value);
    if (onDirectionChange) onDirectionChange();
  }, [onDirectionChange]);

  const setExclusions = useCallback((value: string) => {
    setExclusionsState(value);
    if (onDirectionChange) onDirectionChange();
  }, [onDirectionChange]);

  /**
   * Resets all creative direction values to empty strings
   */
  const resetCreativeDirection = useCallback(() => {
    setGenreState('');
    setEmotionState('');
    setInspirationState('');
    setInspirationTextState('');
    setExclusionsState('');
  }, []);

  /**
   * Returns an object with all non-empty creative direction values
   */
  const getCreativeDirectionObject = useCallback((): CreativeDirection => {
    const direction: CreativeDirection = {};
    
    if (genre) direction.genre = genre;
    if (emotion) direction.emotion = emotion;
    if (inspiration) direction.inspiration = inspiration;
    if (inspirationText) direction.inspirationText = inspirationText;
    if (exclusions) direction.exclusions = exclusions;
    
    return direction;
  }, [genre, emotion, inspiration, inspirationText, exclusions]);

  /**
   * Sets all creative direction values from an object
   */
  const setCreativeDirectionFromObject = useCallback((direction: CreativeDirection) => {
    if (direction.genre !== undefined) setGenreState(direction.genre);
    if (direction.emotion !== undefined) setEmotionState(direction.emotion);
    if (direction.inspiration !== undefined) setInspirationState(direction.inspiration);
    if (direction.inspirationText !== undefined) setInspirationTextState(direction.inspirationText);
    if (direction.exclusions !== undefined) setExclusionsState(direction.exclusions);
  }, []);

  return {
    genre,
    emotion,
    inspiration,
    inspirationText,
    exclusions,
    setGenre,
    setEmotion,
    setInspiration,
    setInspirationText,
    setExclusions,
    resetCreativeDirection,
    getCreativeDirectionObject,
    setCreativeDirectionFromObject
  };
};