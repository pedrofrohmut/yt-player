import { join } from "path"
import * as fs from "fs"
import youtubedl from "youtube-dl-exec"

import ffmpeg from "ffmpeg"

const FILES_DIR_PATH = join(__dirname, "../../files")

const downloadVideo = async (url: string): Promise<void> => {
    const info = await youtubedl(url, {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: ["referer:youtube.com", "user-agent:googlebot"],

        // Post Processing
        extractAudio: true,
        audioFormat: "mp3",
        audioQuality: 10 // 0 to 10 where 0 (best) and 10 (worst)
    })

    // Write the info so youtube-dl can use it
    fs.writeFileSync("videoinfo.json", JSON.stringify(info))

    console.log("...Info saved")

    // Use info file to download the video
    await youtubedl.exec("", {
        loadInfoJson: "videoinfo.json",
        output: `${FILES_DIR_PATH}/_temp_.mp4`
    })

    console.log("...Video download complete")
}

const extractAudioToOtherFile = async (): Promise<string> => {
    const videoPath = `${FILES_DIR_PATH}/_temp_.mp4.webm`
    const audioPath = `${FILES_DIR_PATH}/_output_.mp3`

    const resultMessage: string = await new Promise((resolve, reject) => {
        try {
            new ffmpeg(videoPath).then(
                (video: any) => {
                    video.fnExtractSoundToMP3(audioPath, (error: any, file: string) => {
                        if (!error) resolve(file)
                    })
                },
                (err: any) => reject("Error: " + err)
            )
        } catch (err: any) {
            reject(`Error: (code) ${err.code}. \n (message) ${err.msg}`)
        }
    })

    return resultMessage
}

const removeVideoFile = (): Promise<string> => {
    const outputPath = `${FILES_DIR_PATH}/_temp_.mp4.webm`

    return new Promise((resolve, reject) => {
        fs.unlink(outputPath, (err) => {
            if (err) {
                reject("Error to delete video: " + err)
                //return
            }
            resolve(`Video File '${outputPath}' was deleted`)
        })
    })
}

export const downloadVideoAndConvertToMp3 = async (_event: any, url: string) => {
    console.log("...Download Starting")

    await downloadVideo(url)
    const message = await extractAudioToOtherFile()
    console.log("Extract Message: " + (message || "No message"))
    await removeVideoFile()

    return "Download Complete"
}
