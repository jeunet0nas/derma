import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ZoneAnalysis, RiskLevel } from "@/types/api.types";
import { translateRiskLevel } from "@/utils/translations";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ZonesAccordionProps {
  zones: ZoneAnalysis[];
}

const RISK_CONFIG: Record<
  RiskLevel,
  { color: string; bgColor: string; icon: string }
> = {
  High: { color: "#ef4444", bgColor: "#fee2e2", icon: "🔴" },
  Medium: { color: "#f59e0b", bgColor: "#fef3c7", icon: "🟡" },
  Low: { color: "#10b981", bgColor: "#d1fae5", icon: "🟢" },
};

export default function ZonesAccordion({ zones }: ZonesAccordionProps) {
  const [expandedZones, setExpandedZones] = useState<string[]>([]);

  const toggleZone = (zoneName: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedZones((prev) =>
      prev.includes(zoneName)
        ? prev.filter((z) => z !== zoneName)
        : [...prev, zoneName]
    );
  };

  return (
    <View className="bg-white p-5 mb-4 border-l-4 border-[#0a7ea4]">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <Ionicons name="map-outline" size={22} color="#0a7ea4" />
        <Text className="text-lg font-bold text-slate-900 ml-2">
          Chi tiết theo vùng
        </Text>
        <View className="ml-auto bg-slate-100 px-3 py-1 rounded-full">
          <Text className="text-sm font-semibold text-slate-800">
            {zones.length} vùng
          </Text>
        </View>
      </View>

      {/* Zones List */}
      <View className="gap-3">
        {zones.map((zone, index) => {
          const isExpanded = expandedZones.includes(zone.zone);
          const riskConfig = RISK_CONFIG[zone.riskLevel];

          return (
            <TouchableOpacity
              key={index}
              onPress={() => toggleZone(zone.zone)}
              activeOpacity={0.7}
              className="border border-gray-300 rounded-xl overflow-hidden"
            >
              {/* Zone Header */}
              <View
                className="p-4"
                style={{ backgroundColor: riskConfig.bgColor }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 flex-row items-center">
                    <Text className="text-2xl mr-2">{riskConfig.icon}</Text>
                    <View className="flex-1">
                      <Text className="text-base font-bold text-slate-900">
                        {zone.zone}
                      </Text>
                      <Text
                        className="text-sm font-semibold mt-0.5"
                        style={{ color: riskConfig.color }}
                      >
                        {translateRiskLevel(zone.riskLevel)}
                      </Text>
                    </View>
                  </View>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#64748b"
                  />
                </View>

                {/* Condition Preview */}
                {!isExpanded && (
                  <Text
                    className="text-sm text-gray-800 mt-2"
                    numberOfLines={1}
                  >
                    {zone.condition}
                  </Text>
                )}
              </View>

              {/* Expanded Content */}
              {isExpanded && (
                <View className="bg-white p-4 border-t border-gray-200">
                  {/* Condition */}
                  <View className="mb-3">
                    <Text className="text-xs font-semibold text-gray-600 mb-1">
                      TÌNH TRẠNG
                    </Text>
                    <Text className="text-sm text-gray-950 leading-5">
                      {zone.condition}
                    </Text>
                  </View>

                  {/* Visual Evidence */}
                  <View className="mb-3">
                    <Text className="text-xs font-semibold text-gray-600 mb-1">
                      DẤU HIỆU NHẬN BIẾT
                    </Text>
                    <Text className="text-sm text-gray-800 leading-5">
                      {typeof zone.visualEvidence === "string"
                        ? zone.visualEvidence
                        : zone.visualEvidence.visualClues}
                    </Text>
                    {typeof zone.visualEvidence === "object" &&
                      zone.visualEvidence.certainty !== undefined && (
                        <View className="flex-row items-center mt-2">
                          <View className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <View
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min(100, Math.max(0, (zone.visualEvidence.certainty || 0) * 100))}%`,
                                backgroundColor: riskConfig.color,
                              }}
                            />
                          </View>
                          <Text className="text-xs text-gray-700 ml-2">
                            {Math.round(
                              (zone.visualEvidence.certainty || 0) * 100
                            )}
                            % chắc chắn
                          </Text>
                        </View>
                      )}
                  </View>

                  {/* Explanation */}
                  <View className="bg-blue-50 p-3 border-l-2 border-blue-300">
                    <View className="flex-row items-start">
                      <Ionicons name="bulb-outline" size={18} color="#3b82f6" />
                      <View className="flex-1 ml-2">
                        <Text className="text-xs font-semibold text-blue-900 mb-1">
                          GIẢI THÍCH
                        </Text>
                        <Text className="text-sm text-blue-800 leading-5">
                          {zone.explanation}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
