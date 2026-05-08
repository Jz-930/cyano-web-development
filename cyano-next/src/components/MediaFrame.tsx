import Image from "next/image";

type MediaTone = "mint" | "amber" | "coral" | "blue";

type MediaFrameProps = {
    src: string;
    alt: string;
    label: string;
    tone?: MediaTone;
    square?: boolean;
    priority?: boolean;
};

const MediaFrame = ({
    src,
    alt,
    label,
    tone = "mint",
    square = false,
    priority = false,
}: MediaFrameProps) => {
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
                <span>后续替换为实际截图 / 客户场景图</span>
            </figcaption>
        </figure>
    );
};

export default MediaFrame;
