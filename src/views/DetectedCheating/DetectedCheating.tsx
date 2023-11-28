/*
 * Copyright (C)  Online-Go.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from "react";
import { useUser } from "hooks";
import { get } from "requests";

export function DetectedCheating(): JSX.Element {
    const user = useUser();
    const [detectionData, setDetectionData] = React.useState({
        detectionCount: 0,
        fpCount: 0,
        fpRate: 0,
    });
    const [detections, setDetections] = React.useState([]);

    React.useEffect(() => {
        console.log("TEST");
        get("cheat_detection/report")
            .then((res) => {
                setDetectionData({
                    detectionCount: res.detection_count,
                    fpCount: res.false_positives,
                    fpRate: res.false_positive_rate,
                });

                setDetections(res.detections);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    if (!user.is_moderator && !user.moderator_powers) {
        return null;
    }

    return (
        <div className="detected-cheating">
            <h3>Detected Cheating</h3>
            <div>
                Detections: {detectionData.detectionCount}
                <br /> False Positives: {detectionData.fpCount}
                <br /> False Positive Rate: {detectionData.fpRate}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Game ID</th>
                        <th>Suspected Player</th>
                        <th>Size</th>
                        <th>Move Count</th>
                        <th>Blur Rate</th>
                        <th>SGF Downloads</th>
                        <th>AILR</th>
                        <th>Timing Consistency</th>
                        <th>Composite</th>
                        <th>False Positive</th>
                    </tr>
                </thead>
                <tbody>
                    {detections.map((detection, index) => {
                        return (
                            <tr key={index}>
                                <td>{detection.game.id}</td>
                                <td>{detection.player.id}</td>
                                <td>{detection.size}</td>
                                <td>{detection.move_count}</td>
                                <td>{detection.blur_rate}</td>
                                <td>{detection.sgf_downloads}</td>
                                <td>{detection.ailr}</td>
                                <td>{detection.timing_consistency}</td>
                                <td>{detection.composite}</td>
                                <td>{detection.false_positive}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
