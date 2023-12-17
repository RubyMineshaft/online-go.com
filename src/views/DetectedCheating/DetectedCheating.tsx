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
import { Link } from "react-router-dom";
import { get } from "requests";
import { PaginatedTable } from "PaginatedTable";
import { Player } from "Player";

export function DetectedCheating(): JSX.Element {
    const user = useUser();
    const [detectionData, setDetectionData] = React.useState({
        detectionCount: 0,
        fpCount: 0,
        fpRate: 0,
    });
    const [fpOnly, setFpOnly] = React.useState(false);

    function load_detections() {
        get("cheat_detection/report")
            .then((res) => {
                setDetectionData({
                    detectionCount: res.detection_count,
                    fpCount: res.false_positives,
                    fpRate: res.false_positive_rate,
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    React.useEffect(() => {
        load_detections();
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
            False Positives Only{" "}
            <input type="checkbox" checked={fpOnly} onChange={() => setFpOnly(!fpOnly)} />
            <PaginatedTable
                className="detected-cheating-table"
                source="cheat_detection/list"
                filter={fpOnly ? { false_positive: true } : {}}
                columns={[
                    {
                        header: "Game ID",
                        render: (X) => (
                            <Link to={`/game/${X.game.id}`} target="_blank">
                                {X.game.id}
                            </Link>
                        ),
                    },
                    {
                        header: "Player",
                        render: (X) => <Player user={X.player.id} />,
                    },
                    {
                        header: "Size",
                        render: (X) => `${X.size}x${X.size}`,
                    },
                    {
                        header: "Move Count",
                        render: (X) => X.stats.move_count,
                    },
                    {
                        header: "Blur Rate",
                        render: (X) => Math.round(X.stats.blur_rate),
                    },
                    {
                        header: "SGF Downloads",
                        render: (X) => X.stats.has_sgf_downloads.toString(),
                    },
                    {
                        header: "AILR",
                        render: (X) => Math.round(X.stats.AILR),
                    },
                    {
                        header: "Timing Consistency",
                        render: (X) => X.stats.timing_consistency,
                    },
                    {
                        header: "Composite",
                        render: (X) => X.stats.composite?.toFixed(3),
                    },
                    {
                        header: "False Positive",
                        render: (X) => X.false_positive?.toString(),
                    },
                ]}
            />
        </div>
    );
}
