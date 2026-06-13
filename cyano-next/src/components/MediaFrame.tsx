"use client";

import Image from "next/image";
import { useI18n } from "@/i18n/LanguageProvider";

type MediaTone = "mint" | "amber" | "coral" | "blue";

type MediaFrameProps = {
    src: string;
    alt: string;
    label: string;
    caption?: string | null;
    tone?: MediaTone;
    square?: boolean;
    priority?: boolean;
};

const MediaFrame = ({
    src,
    alt,
    label,
    caption,
    tone = "mint",
    square = false,
    priority = false,
}: MediaFrameProps) => {
    const { content } = useI18n();
    const resolvedCaption = caption === undefined ? content.common.mediaDefaultCaption : caption;

    return (
        <figure className={`media-frame media-frame--${tone} ${square ? "media-frame--square" : ""}`}>
            <div className="media-frame__image-wrap">
                <Image
                    src={src}
                    alt={alt}
                    width={960}
                    height={620}
                    className="media-frame__image"
                    priority={priority}
                />
            </div>
            <figcaption className="media-frame__caption">
                <strong>{label}</strong>
                {resolvedCaption && <span>{resolvedCaption}</span>}
            </figcaption>
        </figure>
    );
};

export default MediaFrame;
