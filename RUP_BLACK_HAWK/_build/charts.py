# Gráficos de apoyo (PNG) para la monografía y la presentación.
import json, numpy as np, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
M = json.load(open('model.json'))
OUT = '../DIAGRAMAS_UML/png/'
INK, GREY, LIGHT, PUR, PUR_L = '#111111', '#6B7280', '#E5E7EB', '#6D28D9', '#EDE4FB'
plt.rcParams.update({'font.family': 'Liberation Sans', 'font.size': 11, 'axes.edgecolor': '#9CA3AF',
                     'axes.labelcolor': INK, 'xtick.color': '#374151', 'ytick.color': '#374151'})

# 1) Curvas de esfuerzo por disciplina (gráfico de "jorobas" de RUP), a partir de la matriz de intensidad
disc = M['DISCIPLINAS']
weeks = np.linspace(0, 14, 400)
bounds = [0, 2, 6, 12, 14]
centers = [(bounds[i] + bounds[i+1]) / 2 for i in range(4)]
fig, axes = plt.subplots(len(disc), 1, figsize=(11, 7.2), sharex=True)
for ax, d in zip(axes, disc):
    step = np.zeros_like(weeks)
    for i in range(4):
        step[(weeks >= bounds[i]) & (weeks <= bounds[i+1])] = d['v'][i]
    k = np.exp(-np.linspace(-3, 3, 61) ** 2 / 2); k /= k.sum()
    y = np.convolve(np.pad(step, 30, mode='edge'), k, mode='valid') / 4.0
    col = PUR if d['t'] == 'Ingeniería' else GREY
    ax.fill_between(weeks, 0, y, color=col, alpha=0.85 if d['t'] == 'Ingeniería' else 0.6, lw=0)
    ax.set_ylim(0, 1.05); ax.set_yticks([])
    for s in ['top', 'right', 'left']: ax.spines[s].set_visible(False)
    ax.text(-0.2, 0.35, d['n'], ha='right', va='center', fontsize=10.5, color=INK)
    for b in bounds[1:-1]: ax.axvline(b, color='#D1D5DB', lw=0.8)
axes[0].set_title('Distribución del esfuerzo por disciplina a lo largo del ciclo de vida (SGCD-BH)', fontsize=13, fontweight='bold', loc='left', pad=40)
for c, f in zip(centers, M['FASES']):
    axes[0].text(c, 1.12, f['n'], ha='center', va='bottom', fontsize=11, fontweight='bold', transform=axes[0].get_xaxis_transform())
axes[-1].set_xticks([1, 3, 5, 7, 9, 11, 13]); axes[-1].set_xticklabels(['I1', 'E1', 'E2', 'C1', 'C2', 'C3', 'T1'])
axes[-1].set_xlabel('Iteraciones (semanas 1–14)')
fig.text(0.01, 0.01, 'Curvas ilustrativas construidas desde la matriz de intensidad del proyecto (0–4). Morado: disciplinas de ingeniería; gris: de soporte.', fontsize=9, color=GREY)
plt.subplots_adjust(left=0.27, right=0.98, top=0.86, bottom=0.1, hspace=0.15)
fig.savefig(OUT + 'G01_esfuerzo_rup.png', dpi=200); plt.close(fig)

# 2) Gantt
G = M['GANTT']; H = M['HITOS']
fig, ax = plt.subplots(figsize=(11, 5.2))
phase_col = {'Inicio': '#9CA3AF', 'Elaboración': '#A78BFA', 'Construcción': PUR, 'Transición': INK}
for i, t in enumerate(G):
    y = len(G) - 1 - i
    ax.barh(y, t['e'] - t['s'] + 1, left=t['s'] - 0.5, height=0.56, color=phase_col[t['f']], edgecolor='white')
    ax.text(0.1 - 0.5 + 0.0, y, t['t'], ha='right', va='center', fontsize=10.5, transform=ax.transData)
for h in H:
    ax.axvline(h['s'] + 0.5, color=INK, lw=1, ls=(0, (3, 3)))
    ax.text(h['s'] + 0.5, len(G) - 0.2, h['n'], ha='center', va='bottom', fontsize=10, fontweight='bold',
            bbox=dict(boxstyle='round,pad=0.25', fc='white', ec=INK, lw=0.8))
ax.set_xlim(0.5, 14.5); ax.set_ylim(-0.7, len(G) + 0.6)
ax.set_xticks(range(1, 15)); ax.set_xticklabels([f'S{i}' for i in range(1, 15)])
ax.set_yticks([])
for s in ['top', 'right', 'left']: ax.spines[s].set_visible(False)
ax.grid(axis='x', color='#EEE', lw=0.8); ax.set_axisbelow(True)
handles = [plt.Rectangle((0, 0), 1, 1, color=c) for c in phase_col.values()]
ax.legend(handles, phase_col.keys(), loc='lower center', bbox_to_anchor=(0.5, -0.2), ncol=4, frameon=False)
ax.set_title('Cronograma del proyecto SGCD-BH (14 semanas académicas)', loc='left', fontsize=13, fontweight='bold', pad=22)
plt.subplots_adjust(left=0.31, right=0.98, top=0.86, bottom=0.17)
fig.savefig(OUT + 'G02_gantt.png', dpi=200); plt.close(fig)

# 3) Matriz de probabilidad e impacto
R = M['RIESGOS']
fig, ax = plt.subplots(figsize=(7.8, 6.4))
for p in range(1, 6):
    for i in range(1, 6):
        s = p * i
        c = '#F3F4F6' if s < 6 else ('#DDD6FE' if s < 12 else ('#A78BFA' if s < 16 else '#6D28D9'))
        ax.add_patch(plt.Rectangle((i - 0.5, p - 0.5), 1, 1, color=c, ec='white', lw=2))
from collections import defaultdict
cells = defaultdict(list)
for r in R: cells[(r['i'], r['p'])].append(r['id'])
for (i, p), ids in cells.items():
    txt_col = 'white' if p * i >= 16 else INK
    ax.text(i, p, '\n'.join(ids), ha='center', va='center', fontsize=10.5, fontweight='bold', color=txt_col)
ax.set_xlim(0.5, 5.5); ax.set_ylim(0.5, 5.5)
ax.set_xticks(range(1, 6)); ax.set_xticklabels(['1\nMuy bajo', '2\nBajo', '3\nMedio', '4\nAlto', '5\nMuy alto'])
ax.set_yticks(range(1, 6)); ax.set_yticklabels(['1 Rara', '2 Poco prob.', '3 Posible', '4 Probable', '5 Casi segura'])
ax.set_xlabel('Impacto'); ax.set_ylabel('Probabilidad')
for s in ax.spines.values(): s.set_visible(False)
ax.tick_params(length=0)
ax.set_title('Matriz de probabilidad e impacto (P × I)', loc='left', fontsize=13, fontweight='bold')
leg = [('Bajo (< 6)', '#F3F4F6'), ('Medio (6–11)', '#DDD6FE'), ('Alto (12–15)', '#A78BFA'), ('Crítico (≥ 16)', '#6D28D9')]
ax.legend([plt.Rectangle((0, 0), 1, 1, color=c) for _, c in leg], [n for n, _ in leg], loc='upper center', bbox_to_anchor=(0.5, -0.16), ncol=4, frameon=False, fontsize=9.5)
plt.tight_layout()
fig.savefig(OUT + 'G03_matriz_riesgos.png', dpi=200); plt.close(fig)

# 4) Distribución de esfuerzo por fase (horas estimadas)
E = M['ESFUERZO']; tot = sum(e['h'] for e in E)
fig, ax = plt.subplots(figsize=(8, 3.2))
left = 0
cols = ['#9CA3AF', '#A78BFA', PUR, INK]
for e, c in zip(E, cols):
    ax.barh(0, e['h'], left=left, color=c, height=0.5, edgecolor='white', lw=2)
    ax.text(left + e['h'] / 2, 0, f"{e['f']}\n{e['h']} h · {round(100*e['h']/tot)} %", ha='center', va='center', color='white', fontsize=10, fontweight='bold')
    left += e['h']
ax.set_xlim(0, tot); ax.axis('off')
ax.set_title(f'Esfuerzo estimado por fase: {tot} horas-persona (supuesto académico)', loc='left', fontsize=12, fontweight='bold')
plt.tight_layout(); fig.savefig(OUT + 'G04_esfuerzo_fases.png', dpi=200); plt.close(fig)
print('ok')
