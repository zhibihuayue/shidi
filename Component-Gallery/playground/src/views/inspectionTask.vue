<template>
  <div id="app">
    <div class="area">
      <!-- <DiseasesPests :resizeY="90" :resizeX="90" :mapId="mapId"/> -->
    <!-- <LandscapeFeatures /> -->
    <!-- <EcosystemChanges /> -->
    <!-- <BirdHabitatAnalysis :mapId="mapId"/> -->
    <!-- <ClimateStatistics /> -->
     <d-wildlife-bird-camera :mapId="mapId" class="text-view" /> 
    </div>
    <d-map :mapId="mapId" width="100%" height="100%" :src="url" />
  </div>
</template>

<script>

import BirdHabitatAnalysis from "@component-gallery/BirdHabitatAnalysis"
import DiseasesPests from "@component-gallery/DiseasesPests"
import EcosystemChanges from "@component-gallery/EcosystemChanges"
import ClimateStatistics from "@component-gallery/ClimateStatistics"
import LandscapeFeatures from "@component-gallery/LandscapeFeatures"
import VoiceprintCollection from '@component-gallery/wildlife-bird-camera'
import Map from '@component-gallery/map'
import mapImg from './screens/mapImg.png'
// console.log('🚀 ~ VoiceprintCollection:', VoiceprintCollection.name)

export default {
  name: 'App',
  components: {
    [BirdHabitatAnalysis.name]: BirdHabitatAnalysis,
    [LandscapeFeatures.name]: LandscapeFeatures,
    [DiseasesPests.name]: DiseasesPests,
    [EcosystemChanges.name]: EcosystemChanges,
    [ClimateStatistics.name]: ClimateStatistics,
    [VoiceprintCollection.name]: VoiceprintCollection,
    [Map.name]: Map,
  },
  data() {
    return {
      name: '前端ddf',
      url: mapImg,
      mapId: 'mapId'
    }
  }
}
</script>

<style lang="scss">
#app {
  width: 350px;
  display: flex;
 
  .area{
    width:100%;
    z-index:999;
     background: #293e64;
  }
}

.text-view {
  position: relative;
  z-index: 999;
}
</style>
