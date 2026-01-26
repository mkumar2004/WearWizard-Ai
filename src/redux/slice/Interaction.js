
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import axios from 'axios'

// export const fetchLike = createAsyncThunk(
//   'interaction/likeToggle',
//   async ({ userId, locationId }) => {
//     const res = await axios.post(
//       `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/interaction/like-toggle`,
//       { userId, locationId }
//     )
//     return res.data
//   }
// )

// export const fetchComments = createAsyncThunk(
//   'comments/fetchComments',
//   async (locationId) => {
//     const res = await axios.get(
//       `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/interaction/comments/${locationId}`
//     )
//     return { locationId, comments: res.data }
//   }
// )

// export const addComment = createAsyncThunk(
//   'comments/addComment',
//   async ({ userId, locationId, text }) => {
//     const res = await axios.post(
//       `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/interaction/comment`,
//       { userId, locationId, text }
//     )
//     return { locationId, comments: res.data }
//   }
// )

// const interactionSlice = createSlice({
//   name: 'interaction',
//   initialState: {
//     likesByLocation: {},
//     loading: false,
//     commentsByLocation: {},
//     error: null,
//   },
//   reducers: {},
//   extraReducers: builder => {
//     builder
//       .addCase(fetchLike.pending, state => {
//         state.loading = true
//       })
//       .addCase(fetchLike.fulfilled, (state, action) => {
//         const { locationId, liked, likeCount } = action.payload

//         state.likesByLocation[locationId] = {
//           liked,
//           likeCount,
//         }

//         state.loading = false
//       })
//       .addCase(fetchLike.rejected, state => {
//         state.loading = false
//       })

//       .addCase(fetchComments.pending, state => {
//         state.loading = true
//         state.error = null
//       })

//       .addCase(fetchComments.fulfilled, (state, action) => {
//         const { locationId, comments } = action.payload
//         state.commentsByLocation[locationId] = comments
//         state.loading = false
//       })

//       .addCase(fetchComments.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.error.message
//       })
//       .addCase(addComment.pending, state => {
//         state.loading = true
//       })

//       .addCase(addComment.fulfilled, (state, action) => {
//         const { locationId, comments } = action.payload
//         state.commentsByLocation[locationId] = comments
//         state.loading = false
//       })

//       .addCase(addComment.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.error.message
//       })
//   },
// })

// export default interactionSlice.reducer
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL

/* ===================== LIKE ===================== */

export const fetchLike = createAsyncThunk(
  'interaction/likeToggle',
  async ({ userId, locationId }) => {
    const res = await axios.post(
      `${BASE_URL}/api/interaction/like-toggle`,
      { userId, locationId }
    )
    return res.data
  }
)

/* ===================== COMMENTS ===================== */

export const fetchComments = createAsyncThunk(
  'interaction/fetchComments',
  async (locationId) => {
    const res = await axios.get(
      `${BASE_URL}/api/interaction/comments/${locationId}`
    )
    return { locationId, comments: res.data }
  }
)

export const addComment = createAsyncThunk(
  'interaction/addComment',
  async ({ userId, locationId, text }) => {
    const res = await axios.post(
      `${BASE_URL}/api/interaction/comment`,
      { userId, locationId, text }
    )

    // backend returns interaction → extract last comment
    const lastComment =
      res.data.comments[res.data.comments.length - 1]

    return { locationId, comment: lastComment }
  }
)

/* ===================== SLICE ===================== */

const interactionSlice = createSlice({
  name: 'interaction',
  initialState: {
    likesByLocation: {},
    commentsByLocation: {},
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: builder => {
    builder

      /* ---------- LIKE ---------- */
      .addCase(fetchLike.pending, state => {
        state.loading = true
      })

      .addCase(fetchLike.fulfilled, (state, action) => {
        const { locationId, liked, likeCount } = action.payload
        state.likesByLocation[locationId] = { liked, likeCount }
        state.loading = false
      })

      .addCase(fetchLike.rejected, state => {
        state.loading = false
      })

      /* ---------- FETCH COMMENTS ---------- */
      .addCase(fetchComments.pending, state => {
        state.loading = true
        state.error = null
      })

      .addCase(fetchComments.fulfilled, (state, action) => {
        const { locationId, comments } = action.payload
        state.commentsByLocation[locationId] = comments
        state.loading = false
      })

      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      /* ---------- ADD COMMENT ---------- */
      .addCase(addComment.pending, state => {
        state.loading = true
      })

      .addCase(addComment.fulfilled, (state, action) => {
        const { locationId, comment } = action.payload

        if (!state.commentsByLocation[locationId]) {
          state.commentsByLocation[locationId] = []
        }

        state.commentsByLocation[locationId].push(comment)
        state.loading = false
      })

      .addCase(addComment.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default interactionSlice.reducer
