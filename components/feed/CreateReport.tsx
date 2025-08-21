import React, { useState, useCallback, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { extractTagsFromText } from '../../services/geminiService';
import { PlusIcon, PaperAirplaneIcon, ArrowPathIcon } from '../ui/Icons';
import Tag from '../ui/Tag';

const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

interface CreateReportProps {
    onSubmitted: () => void;
}

const CreateReport: React.FC<CreateReportProps> = ({ onSubmitted }) => {
    const { authenticatedUser, addReport } = useApp();
    const [text, setText] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [isSuggestingTags, setIsSuggestingTags] = useState(false);

    const debouncedTagSuggestion = useMemo(() => 
        debounce(async (postText: string) => {
            if (postText.length < 20) return;
            setIsSuggestingTags(true);
            try {
                const suggestedTags = await extractTagsFromText(postText);
                setTags(prevTags => [...new Set([...prevTags, ...suggestedTags])]);
            } catch (error) {
                console.error("Tag suggestion failed:", error);
            } finally {
                setIsSuggestingTags(false);
            }
        }, 1500),
    []);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        debouncedTagSuggestion(e.target.value);
    };

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setMediaPreview(URL.createObjectURL(e.target.files[0]));
        }
    };
    
    const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().startsWith('#') ? tagInput.trim() : `#${tagInput.trim()}`;
            if (!tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setTagInput('');
        }
    };

    const removeTag = useCallback((tagToRemove: string) => {
        setTags(currentTags => currentTags.filter(tag => tag !== tagToRemove));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() && !mediaPreview) return;
        await addReport({
            isAnonymous,
            text,
            mediaUrl: mediaPreview || undefined,
            tags,
            mentions: [],
        });
        onSubmitted();
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
                <textarea
                    value={text}
                    onChange={handleTextChange}
                    placeholder={`Describe the issue, ${authenticatedUser?.name}...`}
                    className="w-full p-2 border-none rounded-md focus:ring-0 text-slate-700 h-24 resize-none"
                />
                
                {mediaPreview && (
                    <div className="my-2 relative">
                        <img src={mediaPreview} alt="Media preview" className="rounded-lg max-h-60 w-auto" />
                        <button type="button" onClick={() => setMediaPreview(null)} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 leading-none w-6 h-6 flex items-center justify-center">&times;</button>
                    </div>
                )}
                
                <div className="my-2">
                    <div className="flex flex-wrap gap-2 items-center">
                        {tags.map(tag => (
                           <Tag key={tag} label={tag} onRemove={() => removeTag(tag)} />
                        ))}
                    </div>
                     <div className="relative mt-2">
                        <input 
                            type="text"
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={handleTagInputKeyDown}
                            placeholder="Add tags and press Enter..."
                            className="w-full p-2 border rounded-md text-sm"
                        />
                         {isSuggestingTags && <ArrowPathIcon className="w-5 h-5 text-slate-400 absolute right-2 top-2 animate-spin" />}
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center space-x-4">
                        <label htmlFor="media-upload" className="cursor-pointer text-slate-500 hover:text-indigo-600 flex items-center space-x-1">
                            <PlusIcon className="w-6 h-6" />
                            <span>Media</span>
                        </label>
                        <input id="media-upload" type="file" className="hidden" accept="image/*" onChange={handleMediaChange} />
                        
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="anonymous-post"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="anonymous-post" className="ml-2 block text-sm text-gray-900">Report Anonymously</label>
                        </div>
                    </div>
                    <button type="submit" className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors" disabled={!text.trim() && !mediaPreview}>
                        <PaperAirplaneIcon className="w-5 h-5" />
                        <span>Submit</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateReport;