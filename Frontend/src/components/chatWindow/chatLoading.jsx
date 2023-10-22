import React from 'react'
import { Stack,Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
const chatLoading = () => {
  return (
      <Stack>
          <Skeleton height='45px'></Skeleton>
          <Skeleton height='45px'></Skeleton>
          <Skeleton height='45px'></Skeleton>
          <Skeleton height='45px'></Skeleton>
          <Skeleton height='45px'></Skeleton>
          <Skeleton height='45px'></Skeleton>
          <Skeleton height='45px'></Skeleton>
          <Skeleton height='45px'></Skeleton>
          <Skeleton height='45px'></Skeleton>
          <Skeleton height='45px'></Skeleton>
          <Skeleton height='45px'></Skeleton>
          

    </Stack>
  )
}

export default chatLoading