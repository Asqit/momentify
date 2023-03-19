import { dtoValidation, protectedRoute } from '~/middlewares'
import * as service from './post.service'
import { CreatePostDto } from './post.dto'
import { upload } from '~/utils/multer'
import { Router } from 'express'

const router = Router()

router.post('/', dtoValidation(CreatePostDto), upload, service.createPost)
router.put('/:id', dtoValidation(CreatePostDto), protectedRoute, service.updatePost)
router.delete('/:id', protectedRoute, service.deletePost)
router.get('/:id', protectedRoute, service.getPost)

export default router
