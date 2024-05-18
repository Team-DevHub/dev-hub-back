require("dotenv").config();
const conn = require("../database/mysql");
const postQuery = require("../queries/postQuery");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../utils/CustomError");
const { param } = require("express-validator");

const writePost = async (writerId, categoryId, title, content, links) => {
  let values = [writerId, categoryId, title, content];

  try {
    const postResult = await conn.query(postQuery.writePost, values);

    // 게시글 작성이 되고 링크가 존재할 경우
    if (postResult[0].affectedRows === 1 && links && links.length > 0) {
      const linkValues = links.map((link) => [postResult[0].insertId, link]);
      await conn.query(postQuery.writeLinks, [linkValues]);
    }

    return {
      isSuccess: true,
      message: "게시글 작성 성공",
    };
  } catch (err) {
    throw err;
  }
};

const getPosts = async (userId, limit, page, myPage, search, categoryId) => {
  try {
    // 페이지네이션
    const offset = (page - 1) * limit;

    let query;
    let params = [];

    // 마이페이지인 경우
    if (myPage) {
      query = postQuery.getPosts;
      params = [userId];
    } else {
      query = postQuery.getAllPosts;
    }

    // 게시글 검색인 경우
    if (search) {
      query = postQuery.getPostsBySearch;
      params.push(`%${search}%`);
    }

    // 카테고리별 조회인 경우
    if (categoryId) {
      query = postQuery.getPostsByCategory;
      params.push(parseInt(categoryId));
    }

    // 페이지네이션 적용
    query += postQuery.limitOffset;
    params.push(limit, offset);

    console.log(query);

    const result = await conn.query(query, params);
    const postDataList = result[0];

    if (postDataList.length > 0) {
      const postList = [];

      for (const postData of postDataList) {
        // 게시글 작성자 조회
        const postWriterResult = await conn.query(
          postQuery.getPostWriterById,
          postData.writer_id
        );
        const { name } = postWriterResult[0][0];

        // 댓글 개수 조회
        const getTotalCommentsResult = await conn.query(
          postQuery.getTotalComments,
          postData.id
        );
        const { count } = getTotalCommentsResult[0][0];

        const postInfo = {
          postId: postData.id,
          title: postData.title,
          categoryId: postData.category_id,
          totalComments: count,
          writer: name,
          createdAt: postData.created_at,
        };

        postList.push(postInfo);
      }

      return {
        isSuccess: true,
        message: "게시글 조회 성공",
        result: postList,
      };
    } else {
      throw new CustomError(
        StatusCodes.NOT_FOUND,
        "게시글이 존재하지 않습니다."
      );
    }
  } catch (err) {
    throw err;
  }
};

const getPostDetail = async (postId) => {
  try {
    const postResult = await conn.query(postQuery.getPostById, postId);
    const postData = postResult[0][0];

    // 게시글이 존재하지 않는 경우
    if (!postData) {
      throw new CustomError(
        StatusCodes.NOT_FOUND,
        "게시글이 존재하지 않습니다."
      );
    }

    // 댓글 정보 조회
    const commentResult = await conn.query(
      postQuery.getCommentsByPostId,
      postId
    );
    const comments = commentResult[0];

    // 댓글 작성자 조회
    const commentList = [];
    for (const comment of comments) {
      const commetWriterResult = await conn.query(
        postQuery.getUserById,
        comment.writer_id
      );
      const commentWriterData = commetWriterResult[0][0];
      const commentInfo = {
        commnetId: comment.id,
        content: comment.content,
        createdAt: comment.created_at,
        writer: {
          userId: commentWriterData.id,
          nickname: commentWriterData.name,
          level: commentWriterData.level,
        },
      };

      commentList.push(commentInfo);
    }

    // 링크 조회
    const linksResult = await conn.query(postQuery.getLinksByPostId, postId);
    const links = linksResult[0].map((link) => link.link);

    const writerResult = await conn.query(
      postQuery.getUserById,
      postData.writer_id
    );
    const writerData = writerResult[0][0];

    // 게시글 상세 조회
    const postInfo = {
      postId: postData.id,
      title: postData.title,
      content: postData.content,
      links: links,
      categoryId: postData.category_id,
      totalComments: comments.length,
      createdAt: postData.created_at,
      comments: commentList,
      writer: {
        userId: writerData.id,
        nickname: writerData.name,
        level: writerData.level,
      },
    };

    return {
      isSuccess: true,
      message: "게시글 상세 조회 성공",
      result: postInfo,
    };
  } catch (err) {
    throw err;
  }
};

const deletePost = async (userId, postId) => {
  try {
    await conn.query(postQuery.deletePost, [userId, postId]);

    return {
      isSuccess: true,
      message: "게시글 삭제 성공",
    };
  } catch (err) {
    throw err;
  }
};

module.exports = { writePost, getPosts, getPostDetail, deletePost };