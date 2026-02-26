import { CardFooter, CardHeader } from '@heroui/react';
import React from 'react';

const PLACEHOLDER_IMAGE = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4"

export default function Comment({comment}) {
  // console.log(comment)
  return (
    <CardFooter>
           <CardHeader className="flex gap-3">
            <img
              alt="heroui logo"
              height={40}
              radius="sm"
              src={comment.commentCreator.photo}
              width={40}
              onError={(e) => {e.target.src = PLACEHOLDER_IMAGE}}
            />
            <div className="flex flex-col">
              <p className="text-md">{comment.commentCreator.name}</p>
              <p className="text-small text-default-500">{comment.createdAt}</p>
              {comment.content && <p>{comment.content}</p> }
              {comment.image && <img src={comment.image}/>}
            </div>
          </CardHeader>
          </CardFooter>
  )
}
