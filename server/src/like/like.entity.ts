import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum LikeType {
  LIKE = "LIKE",
  DISLIKE = "DISLIKE",
}

@Entity()
export class Like {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string; // Foreign key referring to User.id

  @Column()
  postId: string; // Foreign key referring to Post.id

  @Column({
    type: "enum",
    enum: LikeType,
  })
  type: LikeType;
}
