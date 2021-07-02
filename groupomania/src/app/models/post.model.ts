import { User } from './user.model';
import { Like } from './like.model';
import { Comment } from './comment.model';
export class Post {
    post_id: string;
    user_id: string;
    title: string;
    mediaUrl: string;
    likes: Like;
    content: string;
    user: User;
    comments: Comment;
}
