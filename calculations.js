// ============================================================
// CALCULATION & METHODOLOGY ENGINE
// Generates "how we got this number" popups with full citations
// Surf Internet vs Ezee Fiber — Midwest Competitive Intelligence
// ============================================================

function sourceLink(source, url, small) {
    const cls = small ? 'text-[10px]' : 'text-xs';
    if (!url || url === '#') return `<span class="${cls} text-slate-400">[${source}]</span>`;
    return `<a href="${url}" target="_blank" rel="noopener" class="${cls} text-blue-600 underline hover:text-blue-800">[${source}]</a>`;
}

function metricWithSource(label, value, source, sourceUrl, note) {
    let html = `<div class="flex justify-between items-start gap-2 py-1">
        <span class="text-slate-500 text-xs">${label}</span>
        <span class="text-right">
            <span class="font-medium text-xs">${value}</span>
            <sup>${sourceLink(source, sourceUrl, true)}</sup>
        </span>
    </div>`;
    if (note) {
        html += `<div class="text-[10px] text-slate-400 italic -mt-0.5 mb-1 pl-2">${note}</div>`;
    }
    return html;
}

function calcMethodologyHTML(calcId) {
    const calc = CALCULATIONS[calcId];
    if (!calc) return '<p class="text-red-500 text-xs">Calculation not found.</p>';
    let html = `
        <div class="p-4 max-w-md">
            <h3 class="font-bold text-slate-800 text-sm mb-2">${calc.label}</h3>
            <div class="bg-emerald-50 rounded-lg p-3 mb-3">
                <p class="text-emerald-800 font-bold text-lg">${calc.result}</p>
                <p class="text-emerald-600 text-xs mt-1">${calc.formula}</p>
            </div>
            <h4 class="text-xs font-semibold text-slate-600 mb-2">INPUTS</h4>
            <div class="space-y-2">`;
    calc.inputs.forEach(inp => {
        html += `<div class="flex justify-between items-start border-b border-slate-100 pb-1">
            <span class="text-xs text-slate-500">${inp.label}</span>
            <span class="text-right">
                <span class="text-xs font-medium">${inp.value}</span>
                ${inp.asOf ? `<span class="text-[10px] text-slate-400 ml-1">(${inp.asOf})</span>` : ''}
                <br>${sourceLink(inp.source, inp.sourceUrl, true)}
            </span>
        </div>`;
    });
    html += `</div>`;
    if (calc.caveat) {
        html += `<div class="mt-3 bg-amber-50 rounded-lg p-2">
            <p class="text-[10px] text-amber-700 font-semibold">NOTE</p>
            <p class="text-[10px] text-amber-600">${calc.caveat}</p>
        </div>`;
    }
    html += `</div>`;
    return html;
}

function mapPopupHTML(market) {
    const prov = PROVIDERS[market.provider];
    const color = prov ? prov.color : '#6B7280';
    const provName = prov ? prov.name : market.provider;
    const sponsorText = prov ? prov.sponsor : '';
    const statusColors = {
        'Completed': { bg: '#DCFCE7', text: '#15803D' },
        'Core Market': { bg: '#DCFCE7', text: '#15803D' },
        'Core': { bg: '#DCFCE7', text: '#15803D' },
        'Live': { bg: '#DBEAFE', text: '#1D4ED8' },
        'Active': { bg: '#DBEAFE', text: '#1D4ED8' },
        'Active Build': { bg: '#FEF3C7', text: '#92400E' },
        'Expanding': { bg: '#FEF3C7', text: '#92400E' },
        'Construction': { bg: '#FEF3C7', text: '#92400E' },
        'New Build': { bg: '#FEE2E2', text: '#991B1B' },
        'Planned': { bg: '#F3E8FF', text: '#6B21A8' },
        'Grant Awarded': { bg: '#CCFBF1', text: '#0F766E' },
        'Announced': { bg: '#FEF3C7', text: '#92400E' },
    };
    const sc = statusColors[market.status] || { bg: '#F3F4F6', text: '#374151' };
    let html = `<div style="font-family: Inter, -apple-system, sans-serif; min-width: 280px;">
        <div style="font-weight: 700; font-size: 14px; color: ${color}; margin-bottom: 4px;">${market.name}</div>
        <div style="margin-bottom: 4px;">
            <span style="font-weight: 600; font-size: 12px; color: #334155;">${provName}</span>
            <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; margin-left: 6px; background: ${sc.bg}; color: ${sc.text};">${market.status}</span>
        </div>
        <div style="font-size: 10px; color: #94A3B8; margin-bottom: 8px;">${sponsorText}</div>`;
    if (market.passings) {
        html += `<div style="font-size: 12px; margin-bottom: 4px;"><strong>Passings/Investment:</strong> ${market.passings}</div>`;
    }
    if (market.notes) {
        html += `<div style="font-size: 11px; color: #64748B; font-style: italic; margin-bottom: 6px;">${market.notes}</div>`;
    }
    if (market.overlapWith && market.overlapWith.length > 0) {
        const overlapNames = market.overlapWith.map(id => PROVIDERS[id] ? PROVIDERS[id].name : id).join(', ');
        html += `<div style="font-size: 11px; color: #DC2626; font-weight: 600; margin-bottom: 6px;">Fiber Overlap: ${overlapNames}</div>`;
    }
    html += `<div style="border-top: 1px solid #E2E8F0; padding-top: 6px; margin-top: 4px;">
        <a href="${market.sourceUrl}" target="_blank" rel="noopener" style="font-size: 10px; color: #2563EB; text-decoration: underline;">${market.source} &rarr;</a>
    </div></div>`;
    return html;
}

function buildRowHTML(build) {
    const prov = PROVIDERS[build.provider];
    const color = prov ? prov.color : '#6B7280';
    const statusMap = {
        'NEW BUILD': 'bg-red-100 text-red-700',
        'EXPANDING': 'bg-amber-100 text-amber-700',
        'ACTIVE': 'bg-green-100 text-green-700',
        'CONSTRUCTION': 'bg-amber-100 text-amber-700',
        'PLANNED': 'bg-violet-100 text-violet-700',
    };
    const statusCls = statusMap[build.status] || 'bg-gray-100 text-gray-700';
    const riskMap = {
        'High': 'text-red-600 font-bold',
        'Medium': 'text-amber-600 font-medium',
        'Low': 'text-green-600',
    };
    const riskCls = riskMap[build.overlapRisk] || '';
    return `<tr class="border-b border-slate-100 hover:bg-slate-50/50">
        <td class="py-2.5 px-3 text-xs"><span class="inline-flex items-center gap-1.5"><span class="w-2 h-2 rounded-full" style="background:${color}"></span>${prov ? prov.name : build.provider}</span></td>
        <td class="py-2.5 px-3 text-xs font-medium">${build.market}</td>
        <td class="py-2.5 px-3 text-xs">${build.state}</td>
        <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded text-[10px] font-medium ${statusCls}">${build.status}</span></td>
        <td class="py-2.5 px-3 text-xs">${build.targetHHP}</td>
        <td class="py-2.5 px-3 text-xs">${build.timeline}</td>
        <td class="py-2.5 px-3 text-xs ${riskCls}">${build.overlap || ''}</td>
        <td class="py-2.5 px-3 text-xs text-slate-500">${build.notes || ''}</td>
        <td class="py-2.5 px-3">${sourceLink(build.source, build.sourceUrl, true)}</td>
    </tr>`;
}

function overlapCell(val) {
    if (!val) return '<span class="text-slate-200 text-xs">-</span>';
    const map = {
        'core': '<span class="inline-block w-4 h-4 rounded-full bg-green-500" title="Core Market"></span>',
        'active': '<span class="inline-block w-4 h-4 rounded-full bg-blue-400" title="Active"></span>',
        'building': '<span class="inline-block w-4 h-4 rounded-full bg-amber-500 pulse" title="Building"></span>',
        'expanding': '<span class="inline-block w-4 h-4 rounded-full bg-amber-400" title="Expanding"></span>',
        'planned': '<span class="inline-block w-4 h-4 rounded-full bg-violet-400 pulse" title="Planned"></span>',
        'limited': '<span class="inline-block w-4 h-4 rounded-full bg-slate-300" title="Limited"></span>',
        'completed': '<span class="inline-block w-4 h-4 rounded-full bg-green-600" title="Completed"></span>',
        'legacy': '<span class="inline-block w-4 h-4 rounded-full bg-slate-300" title="Legacy"></span>',
    };
    return map[val] || `<span class="text-[10px]">${val}</span>`;
}

function riskBadge(risk) {
    const map = {
        'HIGH': 'bg-red-100 text-red-700 font-bold',
        'Medium': 'bg-amber-100 text-amber-700',
        'Low': 'bg-green-100 text-green-700',
        'N/A': 'bg-slate-100 text-slate-500',
    };
    return `<span class="px-2 py-0.5 rounded text-[10px] ${map[risk] || ''}">${risk}</span>`;
}

function showCalcModal(calcId) {
    const content = calcMethodologyHTML(calcId);
    const modal = document.getElementById('calcModal');
    const body = document.getElementById('calcModalBody');
    body.innerHTML = content;
    modal.classList.remove('hidden');
}

function closeCalcModal() {
    document.getElementById('calcModal').classList.add('hidden');
}

function calcIcon(calcId) {
    return `<button onclick="showCalcModal('${calcId}')" class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[9px] font-bold hover:bg-blue-200 cursor-pointer ml-1" title="How we calculated this">i</button>`;
}
