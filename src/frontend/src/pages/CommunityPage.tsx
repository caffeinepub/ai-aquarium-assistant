import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, MessageCircle, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

type ReactionType = "like" | "angry" | "sad" | "love";

interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: string;
}

interface Post {
  id: number;
  author: string;
  initials: string;
  avatarColor: string;
  topic: "General" | "Problem" | "Showcase" | "Tips";
  text: string;
  image?: string;
  timestamp: string;
  reactions: Record<ReactionType, number>;
  myReaction: ReactionType | null;
  comments: Comment[];
  showComments: boolean;
}

const TOPIC_COLORS: Record<string, string> = {
  General: "bg-blue-100 text-blue-700",
  Problem: "bg-red-100 text-red-700",
  Showcase: "bg-purple-100 text-purple-700",
  Tips: "bg-green-100 text-green-700",
};

const REACTION_EMOJIS: Record<ReactionType, string> = {
  like: "👍",
  angry: "😡",
  sad: "😢",
  love: "❤️",
};

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-teal-500",
];

const SAMPLE_POSTS: Post[] = [
  {
    id: 1,
    author: "Marina Torres",
    initials: "MT",
    avatarColor: "bg-teal-500",
    topic: "Showcase",
    text: "Finally finished my 75-gallon planted tank setup! Took 3 months to get the Dutch aquascape just right. The Rotala and Ludwigia are really starting to fill in nicely. 🌿",
    timestamp: "2 hours ago",
    reactions: { like: 24, angry: 0, sad: 0, love: 18 },
    myReaction: null,
    comments: [
      {
        id: 1,
        author: "James K.",
        text: "Absolutely stunning! What ferts are you using?",
        timestamp: "1h ago",
      },
      {
        id: 2,
        author: "Priya S.",
        text: "Goals! Love the layout 😍",
        timestamp: "45m ago",
      },
    ],
    showComments: false,
  },
  {
    id: 2,
    author: "Derek Choi",
    initials: "DC",
    avatarColor: "bg-amber-500",
    topic: "Problem",
    text: "My betta has been sitting at the bottom of the tank for 2 days and barely eating. Water params look fine — ammonia 0, nitrite 0, nitrate 10ppm, pH 7.0, temp 78°F. Any ideas? 😟",
    timestamp: "5 hours ago",
    reactions: { like: 3, angry: 0, sad: 12, love: 0 },
    myReaction: null,
    comments: [
      {
        id: 1,
        author: "Dr. Fishy",
        text: "Could be constipation — try fasting for 2-3 days then offer a daphnia.",
        timestamp: "4h ago",
      },
    ],
    showComments: false,
  },
  {
    id: 3,
    author: "Sofia Reyes",
    initials: "SR",
    avatarColor: "bg-purple-500",
    topic: "Tips",
    text: "Pro tip: always age your tap water for 24 hours before a water change, even if you dechlorinate. The outgassing makes a huge difference for sensitive species like discus! 💧",
    timestamp: "1 day ago",
    reactions: { like: 47, angry: 2, sad: 0, love: 15 },
    myReaction: null,
    comments: [],
    showComments: false,
  },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [newText, setNewText] = useState("");
  const [newTopic, setNewTopic] = useState<Post["topic"]>("General");
  const [newImage, setNewImage] = useState<string | undefined>(undefined);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>(
    {},
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNewImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePost = () => {
    if (!newText.trim()) return;
    const post: Post = {
      id: Date.now(),
      author: "You",
      initials: "YO",
      avatarColor: AVATAR_COLORS[posts.length % AVATAR_COLORS.length],
      topic: newTopic,
      text: newText,
      image: newImage,
      timestamp: "Just now",
      reactions: { like: 0, angry: 0, sad: 0, love: 0 },
      myReaction: null,
      comments: [],
      showComments: false,
    };
    setPosts((prev) => [post, ...prev]);
    setNewText("");
    setNewImage(undefined);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleReact = (postId: number, reaction: ReactionType) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const prevReaction = p.myReaction;
        const newReactions = { ...p.reactions };
        if (prevReaction) newReactions[prevReaction]--;
        if (prevReaction === reaction)
          return { ...p, reactions: newReactions, myReaction: null };
        newReactions[reaction]++;
        return { ...p, reactions: newReactions, myReaction: reaction };
      }),
    );
  };

  const handleAddComment = (postId: number) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: [
            ...p.comments,
            { id: Date.now(), author: "You", text, timestamp: "Just now" },
          ],
        };
      }),
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const toggleComments = (postId: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, showComments: !p.showComments } : p,
      ),
    );
  };

  return (
    <div className="flex flex-col h-full water-bg">
      <div className="ocean-gradient px-4 pt-10 pb-5">
        <h1 className="font-display text-2xl text-white mb-1">Community</h1>
        <p className="text-white/70 text-sm font-body">
          Share, discuss & help fellow aquarists
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Create Post */}
        <Card className="shadow-card border-border/60">
          <CardContent className="p-4 space-y-3">
            <p className="font-display text-base text-foreground">
              Share with the community
            </p>
            <Textarea
              data-ocid="community.post.textarea"
              placeholder="What's on your mind about your aquarium?"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="font-body resize-none text-sm"
              rows={3}
            />
            <div className="flex gap-2 flex-wrap">
              {(["General", "Problem", "Showcase", "Tips"] as const).map(
                (t) => (
                  <button
                    type="button"
                    key={t}
                    data-ocid="community.topic.toggle"
                    onClick={() => setNewTopic(t)}
                    className={`px-3 py-1 rounded-full text-xs font-body font-semibold transition-all border ${
                      newTopic === t
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {t}
                  </button>
                ),
              )}
            </div>
            {newImage && (
              <div className="relative">
                <img
                  src={newImage}
                  alt="Preview"
                  className="w-full max-h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setNewImage(undefined)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                data-ocid="community.post.upload_button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground text-xs font-body transition-colors"
              >
                <ImagePlus className="w-3.5 h-3.5" />
                Photo
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button
                data-ocid="community.post.submit_button"
                onClick={handlePost}
                disabled={!newText.trim()}
                className="ml-auto ocean-gradient text-white font-body font-semibold text-sm"
                size="sm"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Post
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feed */}
        {posts.length === 0 ? (
          <div className="text-center py-12" data-ocid="community.empty_state">
            <p className="font-body text-muted-foreground">No posts yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                data-ocid={`community.item.${index + 1}`}
              >
                <Card className="shadow-card border-border/60">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full ${post.avatarColor} flex items-center justify-center shrink-0`}
                      >
                        <span className="text-white text-xs font-bold font-body">
                          {post.initials}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-semibold text-sm text-foreground">
                          {post.author}
                        </p>
                        <p className="text-xs text-muted-foreground font-body">
                          {post.timestamp}
                        </p>
                      </div>
                      <Badge
                        className={`text-xs font-body ${TOPIC_COLORS[post.topic]} border-0`}
                        variant="secondary"
                      >
                        {post.topic}
                      </Badge>
                    </div>

                    <p className="text-sm font-body text-foreground/90 leading-relaxed">
                      {post.text}
                    </p>

                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post"
                        className="w-full max-h-52 object-cover rounded-xl"
                      />
                    )}

                    <div className="flex gap-1.5 flex-wrap">
                      {(
                        Object.entries(REACTION_EMOJIS) as [
                          ReactionType,
                          string,
                        ][]
                      ).map(([reaction, emoji]) => (
                        <button
                          type="button"
                          key={reaction}
                          data-ocid="community.toggle"
                          onClick={() => handleReact(post.id, reaction)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-body font-medium transition-all ${
                            post.myReaction === reaction
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary hover:bg-secondary/80 text-foreground"
                          }`}
                        >
                          <span>{emoji}</span>
                          <span>{post.reactions[reaction]}</span>
                        </button>
                      ))}
                      <button
                        type="button"
                        data-ocid="community.comment.toggle"
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-1 ml-auto px-2.5 py-1 rounded-full text-xs font-body font-medium bg-secondary hover:bg-secondary/80 text-muted-foreground transition-all"
                      >
                        <MessageCircle className="w-3 h-3" />
                        {post.comments.length}
                      </button>
                    </div>

                    <AnimatePresence>
                      {post.showComments && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 pt-1"
                        >
                          {post.comments.map((c) => (
                            <div
                              key={c.id}
                              className="flex gap-2 bg-secondary/40 rounded-lg p-2.5"
                            >
                              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                                <span className="text-[9px] font-bold text-muted-foreground">
                                  {c.author[0]}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs font-body font-semibold text-foreground">
                                  {c.author}
                                  <span className="font-normal text-muted-foreground ml-1">
                                    · {c.timestamp}
                                  </span>
                                </p>
                                <p className="text-xs font-body text-foreground/80 mt-0.5">
                                  {c.text}
                                </p>
                              </div>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <Input
                              data-ocid="community.comment.input"
                              placeholder="Add a comment..."
                              value={commentInputs[post.id] ?? ""}
                              onChange={(e) =>
                                setCommentInputs((prev) => ({
                                  ...prev,
                                  [post.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  handleAddComment(post.id);
                              }}
                              className="font-body text-xs h-8"
                            />
                            <Button
                              data-ocid="community.comment.submit_button"
                              size="sm"
                              onClick={() => handleAddComment(post.id)}
                              className="h-8 w-8 p-0 ocean-gradient text-white"
                            >
                              <Send className="w-3 h-3" />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
