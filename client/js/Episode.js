var Episode = function(data, series_data){
  this.id = data.mid
  this.name = htmlEntities(data.name)
  this.description = data.description
  if(data.stills) {
    this.image = data.stills[0].url
  } else if (data.image) {
    this.image = data.image
  } else if (data.series) {
    this.image = data.series.image
  }
  this.broadcasters = data.broadcasters.join(', ')
  this.genres = data.genres.join(', ')
  this.duration = Math.round(data.duration / 60)
  this.date = new Date(data.broadcasted_at * 1000)
  this.broadcasted_at = this.date.getDate() + "/" + (this.date.getMonth() + 1) + "/" + this.date.getFullYear() + " " + ('0' + this.date.getHours()).slice(-2) + ":" + ('0' + this.date.getMinutes()).slice(-2)
  if(series_data){
    this.series = new Series(series_data)
  }

  if(this.name && (!this.series || this.name != this.series.name)) {
    this.label = [this.name, this.broadcasted_at].join(' – ')
  } else {
    this.label = this.broadcasted_at
  }
}

Episode.popular = function(callback, errorCallback) {
  UitzendingGemist.Episode.popular(function(episodes){
    callback(
      episodes.map(function(episode){
        return new Episode(episode, episode.series)
      })
    )
  }, errorCallback)
}

Episode.recent = function(callback, errorCallback) {
  UitzendingGemist.Broadcast.recent(function(broadcasts){
    callback(
      broadcasts.map(function(broadcast){
        return new Episode(broadcast.episode, broadcast.episode.series)
      })
    )
  }, errorCallback)
}

Episode.search = function(query, callback, errorCallback) {
  UitzendingGemist.Episode.search(query, function(episodes){
    callback(
      episodes.map(function(episode){
        return new Episode(episode, episode.series)
      })
    )
  }, errorCallback)
}

Episode.find = function(episode_id, series_id, callback, errorCallback) {
  UitzendingGemist.Series.find(series_id, function(series){
    episode = series.episodes.filter(function(episode){
      return episode.mid == episode_id
    })[0]

    series.episodes.splice(series.episodes.indexOf(episode), 1)

    callback(new Episode(episode, series))
  }, errorCallback)
}
