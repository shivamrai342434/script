var padding = { top: 0, right: 0, bottom: 0, left: 0 },
    w = 300 - padding.left - padding.right,
    h = 300 - padding.top - padding.bottom,
    r = Math.min(w, h) / 2,
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    oldpick = [],
    color = d3.scale.category20();
var svg = d3.select('#wheel').append("svg").attr("width", 1200).attr("height", 1200).data([DATA]);
var container = svg.append("g").attr("class", "chartholder").attr("width", 1200).attr("height", 1200).attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")");
var vis = container.append("g");
var pie = d3.layout.pie().sort(null).value(function (d) { return 1; });
var arc = d3.svg.arc().outerRadius(r);
var arcs = vis.selectAll("g.slice").data(pie).enter().append("g").attr("class", "slice");
arcs.append("path").attr("fill", function (d, i) { return d.data.color; }).attr("stroke", "white").attr("stroke-width", "4").attr("d", function (d) { return arc(d); });
arcs.append("text").attr("transform", function (d) {
    d.innerRadius = 0;
    d.outerRadius = r;
    d.angle = (d.startAngle + d.endAngle) / 2;
    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 30) + ")";
}).attr("text-anchor", "end").text(function (d, i) {
    return DATA[i].label;
}).style({ "fill": "#000000", "font-size": "12px" });
container.on("click", spin);

function spin(d) {
    container.on("click", null);
    if (oldpick.length == DATA.length) {
        console.log("done");
        container.on("click", null);
        return;
    }
    var weightedObj = {};
    for (var i = 0; i < DATA.length; i++) {
        weightedObj[i] = DATA[i].weightage;
    }
    var rand012 = weightedRand(weightedObj);
    var ps = 360 / DATA.length,
        pieslice = Math.round(1440 / DATA.length),
        rng = Math.floor((Math.random() * 1440) + 360);
    rotation = 1440 + (ps * (DATA.length - Number(rand012())))
    picked = Math.round(DATA.length - (rotation % 360) / ps);
    picked = picked >= DATA.length ? (picked % DATA.length) : picked;
    if (oldpick.indexOf(picked) !== -1) {
        d3.select(this).call(spin);
        return;
    } else {
        oldpick.push(picked);
    }
    rotation += 90 - Math.round(ps / 2);
    vis.transition().duration(3000).attrTween("transform", rotTween)
        .each("end", function () {
            document.querySelector("span").innerText = DATA[picked].label;
            document.querySelector("code > p").innerText = DATA[picked].code;
            // add hide class to screen 1st
            document.querySelector(".wheel-screen").classList.add("hide");
            // show the next page
            if (DATA[picked].win === "yes") {
                document.querySelector(".winning-screen").classList.add("show");
            } else {
                document.querySelector(".loosing-screen").classList.add("show");
            }
            /* Comment the below line for restrict spin to sngle time */
            // container.on("click", spin);
        });
}
let closeButton = document.querySelector("dialog > img")
// Form close button closes the dialog box
closeButton.addEventListener("click", () => {
    document.querySelector("dialog").close();
});

//make arrow
svg.append("g").attr("transform", "translate(" + (w + padding.left + padding.right +10) + "," + ((h / 2) + padding.top) + ")").append("path").attr("d", "M-" + (r * .25) + ",0L0," + (r * .15) + "L0,-" + (r * .18) + "Z").style({ "fill": "#EF233C", "filter": "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" });

//draw spin circle
container.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 21).style({ "fill": "#EF233C", "cursor": "pointer", "filter": "drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.25))" });
//spin text
container.append("text").attr("x", 0).attr("y", 4).attr("text-anchor", "middle").text("SPIN").style({ "fill": "#ffffff", "font-size": "10px", "cursor": "pointer" }).on("click", spin);

function rotTween() {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function (t) {
        return "rotate(" + i(t) + ")";
    };
}

// const e = document.querySelector(".wheel-screen");
// e.addEventListener("animationend", (ev) => {
//     console.log('eee', e)
//     if (ev.type === "animationend") {
//         e.style.display = "none";
//     }
// }, false);

// This function weightedRand() is returning the array of max weightage nnumber.
function weightedRand(spec) {
    var i, j, table = [];
    for (i in spec) {
        for (j = 0; j < spec[i] * 10; j++) {
            table.push(i);
        }
    }
    return function () {
        return table[Math.floor(Math.random() * table.length)];
    }
}

async function copyCode() {
    // Get the text field
    var copyText = document.querySelector("code");
    try {
        // await navigator.clipboard.writeText(copyText.innerText);
        await moengage.copyText(copyText.innerText, "Code copied")
        document.querySelector("code img").style.display = "none";
        document.querySelector("code span").style.display = "inline-block";
        console.log('Content copied to clipboard');
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}
