'use client'

import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Footer from "./Footer"
import axios from "axios"
import { format, parseISO } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { Fancybox } from "@fancyapps/ui"
import "@fancyapps/ui/dist/fancybox/fancybox.css"

export default function Albumdetail() {
  const { id } = useParams()
  const [album, setAlbum] = useState(null)
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    // Initialize Fancybox with correct configuration
    Fancybox.bind("[data-fancybox], [data-fancybox='album-cover']", {
      compact: false,
      idle: false,
      dragToClose: false,
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: [
            "zoomIn",
            "zoomOut",
            "toggle1to1",
            "rotateCCW",
            "rotateCW",
            "flipX",
            "flipY",
          ],
          right: [
            "slideshow",
            "thumbs",
            "download", // Add download button
            "close"
          ],
        },
      },
      Thumbs: {
        autoStart: false,
      },
      Slideshow: {
        autoStart: false,
        speed: 3000,
      },
      Images: {
        Panzoom: {
          maxScale: 5,
        },
      },
      on: {
        "Fancybox.initCarousel": (fancybox) => {
          // Add custom download button functionality
          const downloadBtn = fancybox.container.querySelector(".fancybox__button--download")
          if (downloadBtn) {
            downloadBtn.addEventListener("click", () => {
              const currentSlide = fancybox.getSlide()
              if (currentSlide) {
                const imageUrl = currentSlide.src
                const link = document.createElement("a")
                link.href = imageUrl
                link.download = `photo_${currentSlide.index + 1}.jpg`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }
            })
          }
        },
      },
    })

    const fetchAlbumDetails = async () => {
      try {
        const albumResponse = await axios.get(`/api/webalbums/${id}`)
        setAlbum(albumResponse.data)

        const photosResponse = await axios.get(`/api/webalbums/${id}/webfotos`)
        setPhotos(
          photosResponse.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        )
      } catch (error) {
        console.error("Error fetching album details or photos:", error)
      }
    }

    fetchAlbumDetails()

    // Cleanup function
    return () => {
      Fancybox.destroy()
    }
  }, [id])

  const constructImageUrl = (imagePath) => {
    return `${axios.defaults.baseURL}/${imagePath.replace(/\\/g, "/")}`
  }

  const defaultImage = "/path/to/default-image.jpg"

  if (!album) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl text-gray-500">Album tidak ditemukan.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      {/* Album Details */}
      <div className="mx-auto max-w-4xl rounded-lg bg-white px-6 py-12 shadow-lg">
        <a
          data-fancybox="album-cover"
          href={constructImageUrl(album.gambar)}
          data-caption={album.nama}
          className="block relative overflow-hidden rounded-lg"
        >
          <img
            src={constructImageUrl(album.gambar)}
            alt={album.nama}
            className="h-72 w-full rounded-lg object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = defaultImage
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:opacity-100">
            <p className="text-lg font-medium text-white">Lihat Detail</p>
          </div>
        </a>
        <h1 className="mt-6 text-3xl font-bold text-gray-800">{album.nama}</h1>
        <p className="mt-2 text-sm text-gray-500">
          Di Post Tanggal:{" "}
          {format(parseISO(album.createdAt), "dd MMMM yyyy", {
            locale: localeId,
          })}
        </p>
        <p className="mt-4 leading-relaxed text-gray-700">{album.deskripsi}</p>
      </div>

      {/* Photos in the Album */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Foto dalam Album</h2>
        {photos.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {photos.map((photo) => (
              <a
                key={photo.id}
                data-fancybox="gallery"
                href={constructImageUrl(photo.gambar)}
                data-caption={photo.nama}
                className="group relative block overflow-hidden rounded-lg bg-white shadow-lg"
              >
                <img
                  src={constructImageUrl(photo.gambar)}
                  alt={photo.nama}
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = defaultImage
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-lg font-medium text-white">Lihat Detail</p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">Tidak ada foto dalam album ini.</p>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}