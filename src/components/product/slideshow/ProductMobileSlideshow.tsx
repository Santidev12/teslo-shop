'use client'

import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

import './slideshow.css';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';
import { ProductImage } from '../product-image/ProductImage';

interface Props {
    images: string[];
    title: string;
    className?: string
}

export const ProductMobileSlideshow = ({ images, title, className }: Props) => {
    return (
        <div className={className}>
            <Swiper
                style={{
                    width: '80vw',
                    height: '500px'
                }}
                pagination
                autoplay={{
                    delay: 2500
                }}
                modules={[FreeMode, Autoplay, Pagination]}
                className="mySwiper2"
            >
                {

                    images?.map(img => (
                        <SwiperSlide key={img}>
                            <ProductImage
                                src={img}
                                alt={title}
                                width={200}
                                height={200}
                                className='rounded-lg object-fill'
                            />
                        </SwiperSlide>

                    ))
                }
            </Swiper>
        </div>
    )
}
