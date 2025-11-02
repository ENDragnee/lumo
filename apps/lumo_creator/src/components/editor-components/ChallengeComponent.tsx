"use client";

import React, { useEffect, useRef, useCallback, ReactNode } from 'react';
import { useEditor, useNode, Element } from '@craftjs/core';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Loader2, HelpCircle, AlertTriangle, CloudUpload } from 'lucide-react';
import { ChallengeType, IChallenge } from '@/models/Challenge';
// IMPORT the new component
import { ChallengeContentCanvas } from './ChallengeContentCanvas';

// --- Debounce Hook ---
function useDebounce(callback: (...args: any[]) => void, delay: number) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    return useCallback((...args: any[]) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => callback(...args), delay);
    }, [callback, delay]);
}

// --- API Call Functions ---
const createChallengeInDB = async (payload: { contentId: string, challengeType: ChallengeType }): Promise<IChallenge> => {
    const { data } = await axios.post('/api/challenges', payload);
    if (!data.success) throw new Error(data.message || 'Failed to create challenge');
    return data.data;
};

const updateChallengeInDB = async (payload: { challengeId: string, challengeType: ChallengeType }): Promise<IChallenge> => {
    const { challengeId, ...updateData } = payload;
    const { data } = await axios.patch(`/api/challenges/${challengeId}`, updateData);
    if (!data.success) throw new Error(data.message || 'Failed to update challenge');
    return data.data;
};

const deleteChallengeFromDB = async (challengeId: string): Promise<{ success: boolean }> => {
    const { data } = await axios.delete(`/api/challenges/${challengeId}`);
    return data;
};

// --- Component Props ---
export interface ChallengeComponentProps {
    children?: ReactNode;
    challengeType: ChallengeType;
    challengeId?: string;
    padding?: number;
}

export const ChallengeComponent = ({ children, challengeType, challengeId, padding = 16 }: ChallengeComponentProps) => {
    const { id: nodeId } = useNode();
    const { actions: { setProp } } = useEditor();
    const { connectors: { connect, drag } } = useNode();
    const params = useParams();
    const contentId = params.contentId as string;
    
    const isInitialMount = useRef(true);
    const creationAttempted = useRef(false);

    const challengeIdRef = useRef(challengeId);
    useEffect(() => {
        challengeIdRef.current = challengeId;
    }, [challengeId]);

    const createMutation = useMutation({
        mutationFn: createChallengeInDB,
        onSuccess: (data) => {
            setProp(nodeId, (props: ChallengeComponentProps) => {
                props.challengeId = data._id.toString();
            });
            console.log(`Challenge CREATED with ID: ${data._id}`);
        },
        onError: (error) => console.error("Failed to create challenge:", error.message),
    });

    const updateMutation = useMutation({
        mutationFn: updateChallengeInDB,
        onSuccess: (data) => console.log(`Challenge UPDATED with ID: ${data._id}`),
        onError: (error) => console.error("Failed to update challenge:", error),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteChallengeFromDB,
        onSuccess: () => console.log(`Challenge DELETED with ID: ${challengeIdRef.current}`),
        onError: (error) => console.error("Failed to delete challenge:", error),
    });

    const debouncedUpdate = useDebounce(updateMutation.mutate, 1500);

    // --- Effects for Lifecycle Management ---

    // Creation Effect
    useEffect(() => {
        if (challengeId) return;
        if (contentId && !creationAttempted.current) {
            creationAttempted.current = true;
            createMutation.mutate({ contentId, challengeType });
        }
    }, [contentId, challengeId, challengeType, createMutation]);


    // Update effect
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (challengeId && challengeType) {
            debouncedUpdate({ challengeId, challengeType });
        }
    }, [challengeType, debouncedUpdate, challengeId]);


    // Delete effect
    useEffect(() => {
        return () => {
            if (challengeIdRef.current) {
                deleteMutation.mutate(challengeIdRef.current);
            }
        };
    }, []);

    const isLoading = createMutation.isPending;
    const isUpdating = updateMutation.isPending;
    const isError = createMutation.isError;
    const hasId = !!challengeId;

    return (
        <div
            ref={(ref: HTMLDivElement | null) => { if(ref) connect(drag(ref)) }}
            style={{ padding: `${padding}px` }}
            className={cn(
                "relative border-2 border-dashed rounded-lg min-h-[100px] transition-colors",
                !hasId && "bg-muted/30",
                hasId && "border-primary/50 bg-background",
                isError && "border-destructive bg-destructive/10"
            )}
        >
            <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-card px-2 py-1 rounded-full border flex items-center gap-2">
                {isLoading && <><Loader2 className="h-4 w-4 animate-spin"/>Creating...</>}
                {isUpdating && <><CloudUpload className="h-4 w-4 animate-spin"/>Saving...</>}
                {isError && <><AlertTriangle className="h-4 w-4 text-destructive"/>Error</>}
                {hasId && !isLoading && !isUpdating && <><HelpCircle className="h-4 w-4 text-primary"/>{challengeType}</>}
            </div>

            {/* UPDATED: Use the imported ChallengeContentCanvas via the 'is' prop */}
            <Element id="challenge-content" is={ChallengeContentCanvas} canvas>
                {children} 
            </Element>
            
            {challengeId && (
                <p className="absolute bottom-1 left-2 text-[10px] text-muted-foreground/50 select-none">ID: {challengeId}</p>
            )}
        </div>
    );
};

// REMOVED the inline definition of ChallengeContentCanvas from here.

ChallengeComponent.craft = {
    displayName: "Challenge Area",
    props: {
        challengeType: 'quiz' as ChallengeType,
        challengeId: undefined,
        padding: 16
    },
    isCanvas: true, 
};
