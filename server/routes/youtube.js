const express = require('express')
const router = express.Router()
const axios = require('axios');
const auth = require('../middelwares/auth')
const User = require('../models/user')
const Youtube = require('../models/youtube');
const { findOne } = require('../models/posts');
// get all playList for channel
router.get('/channelPlaylists/:id', auth.user, async (req, res) => {
    try {
        const options = {
            method: 'GET',
            url: 'https://youtube-v31.p.rapidapi.com/playlists',
            params: {
                channelId: req.params.id,
                part: 'snippet',
                maxResults: '50'

            },
            headers: {
                'X-RapidAPI-Key': '8123f5d07dmshc2cdd47ae4902c2p12b5c3jsn33f860a35954',
                'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
            }
        };
        const playList = []
        const response = await axios.request(options)
        const data = response.data.items.map(el => {
            playList.push({
                id: el.id,
                title: el.snippet.title,
                img: el.snippet.thumbnails.default.url,

            })
        });
        res.send(playList)
    }
    catch (err) {
        res.send(err.message)
    }
})
// get all videos for playlist
router.get('/playlistItems/:id', auth.user, async (req, res) => {
    try {
        const options = {
            method: 'GET',
            url: 'https://youtube-v31.p.rapidapi.com/playlistItems',
            params: {
                playlistId: req.params.id,
                part: 'snippet',
                maxResults: '50'
            },
            headers: {
                'X-RapidAPI-Key': '8123f5d07dmshc2cdd47ae4902c2p12b5c3jsn33f860a35954',
                'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
            }
        };
        const response = await axios.request(options);
        const videos = []
        const data = response.data.items.map(ele => {
            videos.push({
                videoUrl: `https://www.youtube.com/watch?v=${ele.snippet.resourceId.videoId}&list=${ele.snippet.playlistId}`,
                title: ele.snippet.title,
                img: ele.snippet.thumbnails.default.url,
            })
        });
        res.send(videos);
    } catch (error) {
        console.error(error);
    }
})
// add youtube channel
router.post('/addChannel', auth.user, async (req, res) => {
    try {
        const link = req.body.url
        const ind = link.indexOf("list=")
        const playListId = link.slice(ind + 5)
        const options = {
            method: 'GET',
            url: 'https://youtube-v31.p.rapidapi.com/playlistItems',
            params: {
                playlistId: playListId,
                part: 'snippet'
            },
            headers: {
                'X-RapidAPI-Key': '8123f5d07dmshc2cdd47ae4902c2p12b5c3jsn33f860a35954',
                'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
            }
        };
        const response = await axios.request(options);
        const channelId = response.data.items[0].snippet.channelId
        const channelTitle = response.data.items[0].snippet.channelTitle
        const channelExist = await Youtube.findOne({ userId: req.user._id })
        if (!channelExist) {
            const addChannel = new Youtube({ userId: req.user._id, })
            await addChannel.save()
            const channel = await Youtube.findOneAndUpdate({ userId: req.user._id }, { $push: { youtubeId: { _id: channelId, name: channelTitle } } }, { new: true })
            return res.send(channel)
        }
        const channel = await Youtube.findOneAndUpdate({ userId: req.user._id }, { $push: { youtubeId: { _id: channelId, name: channelTitle } } }, { new: true })
        res.send(channel)
    } catch (e) {
        res.send(e.message)
    }
})
// get all youtube channel for user
router.get('/channelsForUser', auth.user, async (req, res) => {
    try {
        const cahnnels = await Youtube.find({ userId: req.user._id })
        res.send(cahnnels)
    } catch (e) {
        res.send(e.message)
    }
})
module.exports = router