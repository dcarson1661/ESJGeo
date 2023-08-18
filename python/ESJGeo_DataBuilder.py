#ESJGeo_DataBuilder.py is a standalone python script that builds the feature class used in ESJGeo.com
#Each Census "Place" is looped through, selecting the intersecting Census Blocks
#Finally statistics are calculated for each set of Census blocks/ Census Place
#Author: Dane Carson
#Created: 08/18/2021

import arcpy
import statistics
import os

dir_path = os.path.dirname(os.path.realpath(__file__))

placesFC = dir_path+r"\ESJGeo\ESJGeo.gdb\Places"
blockGroupsFC = dir_path+r"\ESJGeo\EJSCREEN.gdb\EJSCREENBlockGroups"
outPutBlockGroups = dir_path+r"\ESJGeo\ESJGeo.gdb\outPutBlockGroups"

#check if output already exists,if not create output feature class to hold results
if arcpy.Exists(outPutBlockGroups) == False:
    print('creating out fc...')
    arcpy.management.CreateFeatureclass(
        out_path=r"C:\Users\dcars\Desktop\ESJGeo_Python\ESJGeo\ESJGeo.gdb",
        out_name="outPutBlockGroups",
        geometry_type="POLYGON",
        template=blockGroupsFC,
        has_m="DISABLED",
        has_z="DISABLED",
        spatial_reference='PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",0.0],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]];-20037700 -30241100 10000;-100000 10000;-100000 10000;0.001;0.001;0.001;IsHighPrecision',
        config_keyword="",
        spatial_grid_1=0,
        spatial_grid_2=0,
        spatial_grid_3=0,
        out_alias=""
    )

#Make feature layers
arcpy.MakeFeatureLayer_management(placesFC, "places_lyr")
arcpy.MakeFeatureLayer_management(blockGroupsFC, "blockGroups_lyr")


#where = "OBJECTID = 17927" #only for testing
where = ""
placesFields = ["FIPS", "NAMELSAD", "StateAbbr"]
blockGroupFields = ["PlaceID",
                    "MINORPCT","MINORPCT_ZScore",
                    "LOWINCPCT", "LOWINCPCT_ZScore",
                    "UNEMPPCT", "UNEMPPCT_ZScore",
                    "LINGISOPCT", "LINGISOPCT_ZScore"]

#loop through places
placesTotal = 28484
placeCount = 0
with arcpy.da.SearchCursor("places_lyr", placesFields, where) as placesCursor:
    for place in placesCursor:
        print(place[1])
        arcpy.management.SelectLayerByAttribute("places_lyr", 'NEW_SELECTION', "FIPS = '{}'".format(place[0]))
        arcpy.management.SelectLayerByLocation("blockGroups_lyr", "intersect", "places_lyr")

        #Create dict for each field to hold list of values
        valuesDict = {}
        for field in blockGroupFields:
            if "ZScore" not in field and field != 'PlaceID':
                valuesDict[field] = []

        blockGroupCount = 0
        with arcpy.da.SearchCursor("blockGroups_lyr", blockGroupFields) as blockGroupCursor:
            for blockGroup in blockGroupCursor:
                blockGroupCount +=1

                for key, value in valuesDict.items():
                    value.append(blockGroup[blockGroupFields.index(key)])

        if blockGroupCount > 1:
            try:
            #create dict to hold statistics for each field
                statisticsDict = {}

                for key, value in valuesDict.items():
                    statisticsDict[key+'_mean'] = statistics.mean(value)
                    statisticsDict[key+'_stdev'] = statistics.stdev(value)

                #print(statisticsDict)

                with arcpy.da.UpdateCursor("blockGroups_lyr", blockGroupFields) as blockGroupsUpdateCursor:
                    for blockGroup in blockGroupsUpdateCursor:
                        for field in blockGroupFields:
                            if "ZScore" not in field and field != 'PlaceID':
                                measuredValueField = blockGroup[blockGroupFields.index(field)]
                                field_mean = statisticsDict[field+'_mean']
                                field_stdev = statisticsDict[field+'_stdev'] #float division by zero error here
                                blockGroup[blockGroupFields.index(field+'_ZScore')] =  (measuredValueField - field_mean) / field_stdev
                                #print(field+' '+str((measuredValueField - field_mean) / field_stdev))

                        blockGroup[blockGroupFields.index("PlaceID")] = place[placesFields.index("FIPS")]

                        blockGroupsUpdateCursor.updateRow(blockGroup)

                arcpy.management.Append(["blockGroups_lyr"], outPutBlockGroups, "TEST")
            except Exception as e:
                print(e)
                pass
        
        placeCount += 1
        print(str(round((placeCount/placesTotal)*100, 2))+'%')

