interface ArticleHeroProps {
  title: string;
  subtitle?: string;
  author: string;
  date: string;
  readTime: string;
  tags?: string[];
}

export default function ArticleHero({ 
  title, 
  subtitle, 
  author, 
  date, 
  readTime,
  tags = []
}: ArticleHeroProps) {
  return (
    <div className="max-w-[650px] mx-auto px-6 pt-16 pb-12">
      {/* Date and Read Time */}
      <time dateTime={date} className="text-[11px] mb-6 block font-mono transition-colors duration-500" style={{ color: 'var(--text-color, #ffffff)', fontFamily: '"IBM Plex Mono", monospace' }}>
        {date}  |  {readTime.toUpperCase()}
      </time>
      
      {/* Title */}
      <h1 className="text-[59.9px] font-bold mb-6 leading-[67.2px] transition-colors duration-500" style={{ color: 'var(--text-color, #ffffff)', letterSpacing: '0px' }}>
        {title}
      </h1>
      
      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <span 
              key={tag}
              className="text-[11px] font-medium hover:opacity-70 transition-all duration-500 cursor-pointer px-2 py-1 rounded-full border font-mono"
              style={{ color: 'var(--text-color, #ffffff)', borderColor: 'var(--text-color, #ffffff)', fontFamily: '"IBM Plex Mono", monospace' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
